import { ConsumerController } from './consumer/consumer.controller.js';
import { createAllGoodWritableStream } from './implementor/all-good-writable-stream.js';
import { createDelayWriteCbWritableStream } from './implementor/delay-write-cb-writable-stream.js';
import { SlowWriteConsumerController } from './consumer/slow-write-consumer.controller.js';
import { init } from './init.js';

/*const consumerController = new ConsumerController();
const slowWriteConsumerController = new SlowWriteConsumerController();

const allGoodWritableStream = createAllGoodWritableStream(
  { writableOptions: { highWaterMark: 20 } }
);

//
// const delayWriteCbWritableStream = createDelayWriteCbWritableStream(
//   { writableOptions: { highWaterMark: 6 } }
// );

await consumerController.run(allGoodWritableStream);

// consumerController.consumerName = 'Consumer 3';
// await consumerController.run(delayWriteCbWritableStream);


// await slowWriteConsumerController.run(allGoodWritableStream);*/

// -----------------

await init(
  createAllGoodWritableStream,
  ConsumerController,
  { writableOptions: { highWaterMark: 20 } }
);

