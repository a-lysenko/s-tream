import { BaseWritable } from './base-writable-stream.js';

export class DelayWriteCbWritable extends BaseWritable {

  chunkIndex = 0;
  constructor(
    {
      writableOptions = { highWaterMark: 101 }
    } = {}
  ) {
    super(
      {
        writableOptions,
        loggerOptions: {
          prefix: 'DelayWriteCbWritable'
        }
      }
    );
  }

  _write(chunk, encoding, callback) {
    const willPostponeCallback = (this.chunkIndex === 1);
    this.logger.log(
      '[write]',
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
        '[write]',
        'callback will be postponed', postponeDelay, 'ms for', this.chunkIndex
      );

      setTimeout(
        () => {
          this.logger.log(
            '[write]',
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
