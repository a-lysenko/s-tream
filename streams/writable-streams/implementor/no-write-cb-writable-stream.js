import { BaseWritable } from './base-writable-stream.js';

class NoWriteCbWritableStream extends BaseWritable {

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
    const willIgnoreCb = (this.chunkIndex === 1);
    this.logger.log(
      `[${this.name}]`, '[write]',
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
        `[${this.name}]`, '[write]',
        'callback has been ignored'
      );
    }
  }
}
export function createNoWriteCbWritableStream(
  {
    name = `NoWriteCbWritable ${Date.now()}`,
    logger = console,
    writableOptions = { highWaterMark: 101 }
  } = {}
) {

  const noWriteCbWritableStream = new NoWriteCbWritableStream(
    {
      name,
      logger,
      writableOptions
    }
  );

  return noWriteCbWritableStream;
}
