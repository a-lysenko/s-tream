import { ConsumerController } from './consumer/consumer.controller.js';
import { AllGoodWritableStream } from './implementor/all-good-writable-stream.js';
import { init } from './init.js';

/*const consumerController = new ConsumerController();
const slowWriteConsumerController = new SlowWriteConsumerController();

const allGoodWritableStream = new AllGoodWritableStream(
  { writableOptions: { highWaterMark: 20 } }
);

//
// const delayWriteCbWritableStream = new DelayWriteCbWritable(
//   { writableOptions: { highWaterMark: 6 } }
// );

await consumerController.run(allGoodWritableStream);

// consumerController.consumerName = 'Consumer 3';
// await consumerController.run(delayWriteCbWritableStream);


// await slowWriteConsumerController.run(allGoodWritableStream);*/

// -----------------

await init(
  AllGoodWritableStream,
  ConsumerController,
  { writableOptions: { highWaterMark: 20 } }
);

