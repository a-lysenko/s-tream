export async function init(
  streamCreatorCtor,
  consumerCtor,
  streamCreatorOptions = {},
  consumerOptions = {},
) {
  const stream = new streamCreatorCtor(streamCreatorOptions);
  const consumer = new consumerCtor(consumerOptions);
  await consumer.run(stream);
}
