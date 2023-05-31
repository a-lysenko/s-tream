import { Readable } from 'stream';

export async function run() {

  const allGoodIteratorReadableSource = Array.from(
    new Array(5),
    (_, index) => `item_#${index}`
  );

  let lastReadItemIndex = -1;

  const allGoodIteratorReadable = new Readable({
    highWaterMark: 12,

    construct(callback) {
      console.log(
        'allGoodIteratorReadable construct',
        'this.readableHighWaterMark', this.readableHighWaterMark,
        'this.readableLength', this.readableLength,
        'this.readableFlowing', this.readableFlowing,
        'this.readable', this.readable
      );
      callback();
    },

    read(size) {
      console.log(
        'allGoodIteratorReadable read', 'size', size,
        'allGoodIteratorReadable.readableLength', allGoodIteratorReadable.readableLength
      );

      if (++lastReadItemIndex < allGoodIteratorReadableSource.length) {
        const dataToPush = allGoodIteratorReadableSource[lastReadItemIndex];
        const pushResult = this.push(dataToPush);

        console.log(
          'allGoodIteratorReadable read', 'pushResult', pushResult,
          'for lastReadItemIndex', lastReadItemIndex,
          'dataToPush', dataToPush,
          'allGoodIteratorReadable.readableLength', allGoodIteratorReadable.readableLength,
        );
      } else {
        console.log(
          'allGoodIteratorReadable read null-push',
          'allGoodIteratorReadable.readableLength', allGoodIteratorReadable.readableLength
        );
        const pushResult = this.push(null);
        console.log(
          'allGoodIteratorReadable read null-push result', pushResult,
          'allGoodIteratorReadable.readableLength', allGoodIteratorReadable.readableLength
        );
      }
    },

    destroy(err, callback) {
      console.log(
        'allGoodIteratorReadable destroy',
        'this.readableLength', this.readableLength,
        'err', err, 'callback', callback
      );
      callback();
    }
  });

  const allGoodIteratorReadableStorage = [];

  allGoodIteratorReadable.on('close', () => {
    console.error(
      'allGoodIteratorReadable event fired: close',
      'allGoodIteratorReadableStorage', allGoodIteratorReadableStorage
    );
  });

  allGoodIteratorReadable.on('end', () => {
    console.error('allGoodIteratorReadable event fired: end');
  });

  allGoodIteratorReadable.on('error', (err) => {
    console.error('allGoodIteratorReadable event fired: error', err);
  });

  for await (const chunk of allGoodIteratorReadable) {
    console.log(
      'allGoodIteratorReadable AWAIT chunk', chunk,
      'chunk.toString()', chunk?.toString(),
      'allGoodIteratorReadable.readableLength', allGoodIteratorReadable.readableLength,
      'allGoodIteratorReadable.readableFlowing', allGoodIteratorReadable.readableFlowing
    );

    allGoodIteratorReadableStorage.push(chunk);
  }
}
