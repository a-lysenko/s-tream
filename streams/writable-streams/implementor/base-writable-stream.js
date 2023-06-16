import { Writable } from 'stream';
import { Logger } from '../../_helpers/logger.js';

const defaultLoggerOptions = {
  prefix: 'BaseWritable',
  prefixSettings: {
    color: 'blueBright',
  },
  chalkStringsOnly: true
}
export class BaseWritable extends Writable {
  logger;

  #streamStorage = [];
  constructor(
    {
      writableOptions = { highWaterMark: 101 },
      loggerOptions = defaultLoggerOptions,
    } = {}
  ) {
    super(
      {
        highWaterMark: writableOptions.highWaterMark ?? 101
      }
    );

    this.logger = new Logger({
      ...defaultLoggerOptions,
      ...loggerOptions
    });

    const timeout = 0;
    setTimeout(
      () => {
        this.logger.log(
          `setTimeout(${timeout}) streamStorage`, this.#streamStorage
        );
      },
      timeout
    );

    this.logger.log('[BaseWritable constructor]');
  }

  _construct(callback) {
    this.logger.log(
      '[construct]',
      'this.writableHighWaterMark', this.writableHighWaterMark
    );
    callback();
  }

  _write(chunk, encoding, callback) {
    this.logger.log(
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
      '[final]',
      'this.writableLength', this.writableLength
    );
    callback();
  }

  _destroy(error, callback) {
    this.logger.log('[destroy]', 'error', error);
    callback(error);
  }

  pushToStreamStorage(chunk) {
    this.#streamStorage.push(chunk);
  }

  get streamStorage() {
    return this.#streamStorage;
  }
}
