import {
  AllGoodWritableStream,
  ConsumerController,
  DelayWriteCbWritable,
  init as initWritableFlow,
  NoWriteCbWritableStream,
  SlowWriteConsumerController
} from '../streams/writable-streams/index.js';

export const streamTypes = {
  Readable: 'Readable',
  Writable: 'Writable',
  Duplex: 'Duplex',
  Transform: 'Transform',
}

export const initFunctionsToStreamTypes = {
  [streamTypes.Readable]: null,
  [streamTypes.Writable]: initWritableFlow,
  [streamTypes.Duplex]: null,
  [streamTypes.Transform]: null,
}
export const writableConsumerTypes = {
  regular: { controller: ConsumerController },
  'slow-write': { controller: SlowWriteConsumerController },
}
export const writableImplementorTypes = {
  'all-good': { streamConstructor: AllGoodWritableStream },
  'delay-write-cb': { streamConstructor: DelayWriteCbWritable },
  'no-write-cb': { streamConstructor: NoWriteCbWritableStream },
}
export const writableStreamQuestionsKeys = {
  Consumer: 'consumer',
  Implementor: 'implementor',
  HighWaterMark: 'highWaterMark',
}
