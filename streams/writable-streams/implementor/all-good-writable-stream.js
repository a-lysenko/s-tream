import { BaseWritable } from './base-writable-stream.js';

export class AllGoodWritableStream extends BaseWritable {
  constructor(
    {
      name = `AllGoodWritable ${Date.now()}`,
      logger = console,
      writableOptions = { highWaterMark: 101 }
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
}
