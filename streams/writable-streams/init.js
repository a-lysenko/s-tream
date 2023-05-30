export async function init(
  streamCreatorCtor, consumerCtor,
  streamCreatorOptions = {}, consumerOptions = {},
  consumerName
) {
  const stream = new streamCreatorCtor(streamCreatorOptions);
  const consumer = new consumerCtor(consumerName, consumerOptions);
  await consumer.run(stream);
}
