export function createWritableSource(length = 5) {
  return Array.from(
    new Array(length),
    (_, index) => `item_#${index}`
  );
}

export function createIterableWritableSource(length = 5) {
  return createWritableSource(length).entries();
}


