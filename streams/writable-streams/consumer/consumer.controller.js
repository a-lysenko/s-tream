import { createWritableListeners } from './create-writable-listeners.js';
import { createIterableWritableSource } from './create-writable-source.js';
import { createDeferred } from '../../_helpers/create-deferred.js';

export class ConsumerController {
  #consumerName;

  #iterableEntriesSource = [].entries();
  #logger;
  #listenersOptions;
  constructor(
    consumerName = `Consumer ${Date.now()}`,
    {
      listenerName,
      listenersIncludeOnly = [],
      listenerExtendCallbacks = {},
      logger = console
    } = {}
  ) {
    this.#consumerName = consumerName;

    this.#logger = logger;

    this.#listenersOptions= {
      name: listenerName,
      includeOnly: listenersIncludeOnly,
      logger: this.#logger,
      extendCallbacks: listenerExtendCallbacks
    };
  }
  async run(stream) {
    const deferred  = createDeferred();

    this.#iterableEntriesSource = createIterableWritableSource();

    const streamListeners = createWritableListeners({
      ...this.#listenersOptions,
      extendCallbacks: {
        drain: () => {
          this.#logger.log(
            `[${this.#consumerName}] INSIDE DRAIN -------------- Start`,
          );
          const allWritten = this.#writeUntilFull(stream);
          this.#logger.log(
            `[${this.#consumerName}] INSIDE DRAIN -------------- allWritten`, allWritten
          );
          if (allWritten) {
            deferred.resolve(true);
          }

          this.#logger.log(
            `[${this.#consumerName}] INSIDE DRAIN -------------- End`,
          );
        },
        ...this.#listenersOptions.extendCallbacks,
      }
    });

    this.#attachListeners(streamListeners, stream);

    const allWritten = this.#writeUntilFull(stream);
    if (allWritten) {
      deferred.resolve(true);
    }

    return deferred.promise;
  }

  #writeUntilFull(stream) {
    let writeResult = true
    for (const [index, elem] of this.#iterableEntriesSource) {
      writeResult = stream.write(elem, 'utf-8', (err) => {
        if (err) {
          this.#logger.error(
            `[${this.#consumerName}]`,
            '[write action -> write cb.]',
            'ERROR', index, 'for elem', elem,
            'stream.writableLength', stream.writableLength,
            'err', err
          );
          return;
        }

        this.#logger.log(
          `[${this.#consumerName}]`,
          '[write action -> write cb.]',
          'created on index', index, 'for elem', elem,
          'stream.writableLength', stream.writableLength
        );
      });


      this.#logger.log(
        `[${this.#consumerName}]`,
        '[write action]',
        'on index', index, 'for elem', elem,
        'writeResult', writeResult,
        'stream.writableLength', stream.writableLength
      );

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
    stream.end(
      'end-chunk',
      () => {
        this.#logger.log(
          `[${this.#consumerName}]`,
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

  set consumerName(value) {
    this.#consumerName = value;
  }
}
