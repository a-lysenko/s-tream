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

  return baseWritable;
}
