import { BaseWritable } from './base-writable-stream.js';

export class AllGoodWritableStream extends BaseWritable {
  constructor(
    {
      writableOptions = { highWaterMark: 101 }
    } = {}
  ) {
    super(
      {
        writableOptions,
        loggerOptions: {
          prefix: 'AllGoodWritable'
        }
      }
    );
  }
}
