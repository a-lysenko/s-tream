import { createDeferred } from '../../_helpers/create-deferred.js';
import { createIterableWritableSource } from './create-writable-source.js';
import { createWritableListeners } from './create-writable-listeners.js';
import { writeChunkWithLogging } from './consumer.controller.js';
import { Logger } from '../../_helpers/logger.js';

export class SlowWriteConsumerController {
  #logger = new Logger({
    prefixSettings: {
      value: 'Slow Consumer',
      color: 'greenBright',
    },
    chalkStringsOnly: true
  });

  #listenersOptions;
  #asyncIterableEntriesSource = (async function* () {
    yield* [].entries();
  })();

  constructor(
    {
      listenersIncludeOnly = [],
      listenerExtendCallbacks = {}
    } = {}
  ) {
    this.#listenersOptions= {
      includeOnly: listenersIncludeOnly,
      logger: this.#logger,
      extendCallbacks: listenerExtendCallbacks
    };
  }

  async run(stream) {
    const deferred  = createDeferred();

    this.#asyncIterableEntriesSource = (async function* () {
      for await (const entry of createIterableWritableSource()) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        yield entry;
      }
    })();

    const streamListeners = createWritableListeners({
      ...this.#listenersOptions,
      extendCallbacks: {
        drain: async () => {
          this.#logger.log('INSIDE DRAIN -------------- Start');
          const allWritten = await this.#writeUntilFull(stream);
          this.#logger.log(
            'INSIDE DRAIN -------------- allWritten', allWritten
          );
          if (allWritten) {
            deferred.resolve(true);
          }

          this.#logger.log('INSIDE DRAIN -------------- End');
        },
        ...this.#listenersOptions.extendCallbacks,
      }
    });

    this.#attachListeners(streamListeners, stream);

    const allWritten = await this.#writeUntilFull(stream, deferred);
    if (allWritten) {
      deferred.resolve(true);
    }

    return deferred.promise;
  }

  async #writeUntilFull(stream) {
    let writeResult = true
    for await (const [index, elem] of this.#asyncIterableEntriesSource) {
      writeResult = writeChunkWithLogging(stream, this.#logger, index, elem);

      if (!writeResult) {
        break;
      }
    }

    if (writeResult) {
      this.#writeEnd(stream);
    }

    return writeResult;
  }

  #writeEnd(stream) {
    this.#logger.log(
      '[end action]',
      'stream.writableLength', stream.writableLength,
    );

    stream.end(
      'end-chunk',
      () => {
        this.#logger.log(
          '[end action -> end cb]',
          'stream.writableLength', stream.writableLength,
        );
      }
    );
  }

  #attachListeners(streamListeners, stream) {
    Object.entries(streamListeners)
      .forEach(
        ([eventName, eventHandler]) => stream.on(eventName, eventHandler)
      );
  }
}
