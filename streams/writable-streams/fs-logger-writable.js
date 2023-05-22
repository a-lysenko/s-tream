import { Writable } from 'stream';

export class FsLoggerWritable extends Writable {
  #logger = console;
  #name = '';

  constructor(
    {
      highWaterMark = 101,
      logger = null,
      externalStorageArr = null,
      name = 'FsLoggerWritable',
      ...options
    }
  ) {
    super({ highWaterMark });

    if (logger) {
      this.#logger = logger;
    }

    if (name) {
      this.#name = name;
    }
  }

  _construct(callback) {
    this.#logger.log(this.#name, ' _construct', 'this.writableHighWaterMark', this.writableHighWaterMark);
    callback();
  }

  _write(chunk, encoding, callback) {
    this.#logger.log(
      this.#name,
      '_write', 'chunk', chunk, 'chunk.toString()', chunk.toString(),
      'encoding', encoding,
      'this.writableLength', this.writableLength
    );

    callback(null);
  }

  _final(callback) {
    this.#logger.log(this.#name, '_final', 'this.writableLength', this.writableLength);
    callback();
  }
}
