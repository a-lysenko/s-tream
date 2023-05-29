import { BaseWritable } from './base-writable-stream.js';

class DelayWriteCbWritable extends BaseWritable {

  chunkIndex = 0;
  constructor(
    {
      name,
      logger,
      writableOptions
    } = {}
  ) {
    super(
      {
        name,
        logger,
        writableOptions,
      }
    );
  }

  _write(chunk, encoding, callback) {
    const willPostponeCallback = (this.chunkIndex === 1);
    this.logger.log(
      `[${this.name}]`, '[write]',
      'chunk', chunk, 'chunk.toString()', chunk.toString(),
      'encoding', encoding,
      'this.chunkIndex', this.chunkIndex,
      'willPostponeCallback', willPostponeCallback,
      'this.writableLength', this.writableLength
    );

    this.pushToStreamStorage(chunk.toString());

    if (willPostponeCallback) {
      const postponeDelay = 4000;
      this.logger.log(
        `[${this.name}]`, '[write]',
        'callback will be postponed', postponeDelay, 'ms for', this.chunkIndex
      );

      setTimeout(
        () => {
          this.logger.log(
            `[${this.name}]`, '[write]',
            'Now I will execute the postponed cb for', chunk.toString(), ':'
          );
          callback(null);
        },
        postponeDelay
      );
    } else {
      callback(null);
    }

    this.chunkIndex++;
  }
}
export function createDelayWriteCbWritableStream(
  {
    name = `DelayWriteCbWritable ${Date.now()}`,
    logger = console,
    writableOptions = { highWaterMark: 101 }
  } = {}
) {

  const delayWriteCbWritable = new DelayWriteCbWritable(
    {
      name,
      logger,
      writableOptions
    }
  );

  setTimeout(
    () => {
      logger.log(
        `[${name}]`,
        'setTimeout(2000) streamStorage', delayWriteCbWritable.streamStorage
      );
    },
    2000
  );

  return delayWriteCbWritable;
}
