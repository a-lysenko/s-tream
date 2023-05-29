import {
  ConsumerController,
  createAllGoodWritableStream,
  createDelayWriteCbWritableStream,
  createNoWriteCbWritableStream,
  init as initWritableFlow,
  SlowWriteConsumerController
} from '../streams/writable-streams/index.js';

export const streamTypes = {
  Readable: 'Readable',
  Writable: 'Writable',
  Duplex: 'Duplex',
  Transform: 'Transform',
}

export const initFunctionsToStreamTypes = {
  [streamTypes.Readable]: 'initReadableStream',
  [streamTypes.Writable]: initWritableFlow,
  [streamTypes.Duplex]: 'initDuplexStream',
  [streamTypes.Transform]: 'initTransformStream',
}
export const writableConsumerTypes = {
  regular: { controller: ConsumerController },
  'slow-write': { controller: SlowWriteConsumerController },
}
export const writableImplementorTypes = {
  'all-good': { streamCreatorFn: createAllGoodWritableStream },
  'delay-write-cb': { streamCreatorFn: createDelayWriteCbWritableStream },
  'no-write-cb': { streamCreatorFn: createNoWriteCbWritableStream },
}
export const writableStreamQuestionsKeys = {
  Consumer: 'consumer',
  Implementor: 'implementor',
  HighWaterMark: 'highWaterMark',
}
