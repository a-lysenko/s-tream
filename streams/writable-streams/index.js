import { ConsumerController } from './consumer/consumer.controller.js';
import { createAllGoodWritableStream } from './implementor/all-good-writable-stream.js';

const consumerController = new ConsumerController();

const allGoodWritableStream = createAllGoodWritableStream(
  { writableOptions: { highWaterMark: 20 } }
);

consumerController.run(allGoodWritableStream);
