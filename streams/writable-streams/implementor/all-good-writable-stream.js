import { BaseWritable } from './base-writable-stream.js';

export class AllGoodWritableStream extends BaseWritable {
  constructor(
    {
      name = 'AllGoodWritable',
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
}
