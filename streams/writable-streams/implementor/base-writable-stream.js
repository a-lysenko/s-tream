import { Writable } from 'stream';

export class BaseWritable extends Writable {
  logger;

  name;
  #streamStorage = [];
  constructor(
    {
      name = `BaseWritable ${Date.now()}`,
      logger = console,
      writableOptions = { highWaterMark: 101 }
    } = {}
  ) {
    super(
      {
        highWaterMark: writableOptions.highWaterMark ?? 101
      }
    );
    this.logger = logger;
    this.name = name;
  }

  _construct(callback) {
    this.logger.log(
      `[${this.name}]`, '[construct]',
      'this.writableHighWaterMark', this.writableHighWaterMark
    );
    callback();
  }

  _write(chunk, encoding, callback) {
    this.logger.log(
      `[${this.name}]`,
      '[write]',
      'chunk', chunk, 'chunk.toString()', chunk.toString(),
      'encoding', encoding,
      'this.writableLength', this.writableLength
    );

    this.pushToStreamStorage(chunk.toString());
    callback(null);
  }

  _final(callback) {
    this.logger.log(
      `[${this.name}]`, '[final]',
      'this.writableLength', this.writableLength
    );
    callback();
  }

  _destroy(error, callback) {
    this.logger.log(`[${this.name}]`, '[destroy]', 'error', error);
    callback(error);
  }

  pushToStreamStorage(chunk) {
    this.#streamStorage.push(chunk);
  }

  get streamStorage() {
    return this.#streamStorage;
  }
}
