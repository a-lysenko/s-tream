import { Writable } from "stream";

export function createAllGoodWritableStream(
  {
    name = `AllGoodWritable ${Date.now()}`,
    logger = console,
    writableOptions = { highWaterMark: 101 }
  } = {}
) {
  const streamStorage = [];
  setTimeout(
    () => {
      logger.log(
        `[${name}]`,
        'setTimeout(2000) streamStorage', streamStorage
      );
    },
    2000
  );

  return new Writable(
    {
      highWaterMark: writableOptions.highWaterMark ?? 101,
      construct(callback) {
        logger.log(`[${name}]`, '[construct]', 'this.writableHighWaterMark', this.writableHighWaterMark);
        callback();
      },
      write(chunk, encoding, callback) {
        logger.log(
          `[${name}]`,
          '[write]',
          'chunk', chunk, 'chunk.toString()', chunk.toString(),
          'encoding', encoding,
          'this.writableLength', this.writableLength
        );

        streamStorage.push(chunk.toString());
        callback(null);
      },
      final(callback) {
        logger.log(
          `[${name}]`,
          '[final]', 'this.writableLength', this.writableLength
        );
        callback();
      },
      destroy(error, callback) {
        logger.log(`[${name}]`, '[destroy]', 'error', error);
        callback(error);
      }
    }
  );
}
export function run() {


}
