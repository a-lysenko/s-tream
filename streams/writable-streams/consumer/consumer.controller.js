import { createWritableListeners } from './create-writable-listeners.js';
import { createIterableWritableSource } from './create-writable-source.js';
import { createDeferred } from '../../_helpers/create-deferred.js';
import { Logger } from '../../_helpers/logger.js';

export class ConsumerController {
  #logger = new Logger({
    prefixSettings: {
      value: 'Consumer',
      color: 'cyan'
    },
    chalkStringsOnly: true
  });

  #listenersOptions;
  #iterableEntriesSource = [].entries();
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

    this.#logger.log('[constructor]');
  }
  async run(stream) {
    const deferred  = createDeferred();

    this.#iterableEntriesSource = createIterableWritableSource();

    const streamListeners = createWritableListeners({
      ...this.#listenersOptions,
      extendCallbacks: {
        drain: () => {
          this.#logger.log('INSIDE DRAIN -------------- Start');
          const allWritten = this.#writeUntilFull(stream);
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

    const allWritten = this.#writeUntilFull(stream);
    if (allWritten) {
      deferred.resolve(true);
    }

    return deferred.promise;
  }

  #writeUntilFull(stream) {
    let writeResult = true;
    for (const [index, elem] of this.#iterableEntriesSource) {
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

export function writeChunkWithLogging(stream, logger, index, elem) {
  const buildMessageContent = () => [
    'on index', index, 'elem', elem,
    'stream.writableLength', stream.writableLength,
  ];

  const writeResult = stream.write(elem, 'utf-8', (err) => {
    if (err) {
      logger.error(
        '[write action -> write cb.]',
        'ERROR',
        ...buildMessageContent(),
        'err', err
      );
      return;
    }

    logger.log(
      '[write action -> write cb.]',
      'OK',
      ...buildMessageContent()
    );
  });

  logger.log(
    '[write action]',
    ...buildMessageContent(),
    'writeResult', writeResult
  );

  return writeResult;
}
