import { BaseWritable } from './base-writable-stream.js';

export function createAllGoodWritableStream(
  {
    name = `AllGoodWritable ${Date.now()}`,
    logger = console,
    writableOptions = { highWaterMark: 101 }
  } = {}
) {
  const baseWritable = new BaseWritable({
    name,
    logger,
    writableOptions,
  });

  setTimeout(
    () => {
      logger.log(
        `[${name}]`,
        'setTimeout(2000) streamStorage', baseWritable.streamStorage
      );
    },
    2000
  );

  return baseWritable;
}
