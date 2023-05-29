export async function init(
  streamCreatorFn, consumerCtor,
  streamCreatorFnOptions = {}, consumerOptions = {},
  consumerName
) {
  const stream = streamCreatorFn(streamCreatorFnOptions);
  const consumer = new consumerCtor(consumerName, consumerOptions);
  await consumer.run(stream);
}
