import { BaseWritable } from './base-writable-stream.js';

export class NoWriteCbWritableStream extends BaseWritable {

  chunkIndex = 0;
  constructor(
    {
      name = 'NoWriteCbWritable',
      writableOptions = { highWaterMark: 101 }
    } = {}
  ) {
    super(
      {
        writableOptions,
        loggerOptions: {
          prefix: name
        }
      }
    );
  }

  _write(chunk, encoding, callback) {
    const willIgnoreCb = (this.chunkIndex === 1);
    this.logger.log(
      '[write]',
      'chunk', chunk, 'chunk.toString()', chunk.toString(),
      'encoding', encoding,
      'this.chunkIndex', this.chunkIndex,
      'willIgnoreCb', willIgnoreCb,
      'this.writableLength', this.writableLength
    );

    this.pushToStreamStorage(chunk.toString());

    this.chunkIndex++;

    if (!willIgnoreCb) {
      callback(null);
    } else {
      this.logger.warn(
        '[write]',
        'callback has been ignored'
      );
    }
  }
}
