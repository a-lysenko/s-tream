import { Readable } from 'stream';

export async function run() {

  const allGoodPausedModeReadableSource = Array.from(
    new Array(5),
    (_, index) => `item_#${index}`
  );

  let lastReadItemIndex = -1;

  const allGoodPausedModeReadable = new Readable({
    highWaterMark: 12,

    construct(callback) {
      console.log(
        'allGoodPausedModeReadable construct',
        'this.readableHighWaterMark', this.readableHighWaterMark,
        'this.readableLength', this.readableLength,
        'this.readableFlowing', this.readableFlowing,
        'this.readable', this.readable
      );
      callback();
    },

    read(size) {
      console.log(
        'allGoodPausedModeReadable read', 'size', size,
        'allGoodPausedModeReadable.readableLength', allGoodPausedModeReadable.readableLength
      );

      if (++lastReadItemIndex < allGoodPausedModeReadableSource.length) {
        const dataToPush = allGoodPausedModeReadableSource[lastReadItemIndex];
        const pushResult = this.push(dataToPush);

        console.log(
          'allGoodPausedModeReadable read', 'pushResult', pushResult,
          'for lastReadItemIndex', lastReadItemIndex,
          'dataToPush', dataToPush,
          'allGoodPausedModeReadable.readableLength', allGoodPausedModeReadable.readableLength,
        );
      } else {
        console.log(
          'allGoodPausedModeReadable read null-push',
          'allGoodPausedModeReadable.readableLength', allGoodPausedModeReadable.readableLength
        );
        const pushResult = this.push(null);
        console.log(
          'allGoodPausedModeReadable read null-push result', pushResult,
          'allGoodPausedModeReadable.readableLength', allGoodPausedModeReadable.readableLength
        );
      }
    },

    destroy(err, callback) {
      console.log(
        'allGoodPausedModeReadable destroy',
        'this.readableLength', this.readableLength,
        'err', err, 'callback', callback
      );
      callback();
    }
  });

  const allGoodPausedModeReadableStorage = [];

  allGoodPausedModeReadable.on('close', () => {
    console.error(
      'allGoodPausedModeReadable event fired: close',
      'allGoodPausedModeReadableStorage', allGoodPausedModeReadableStorage
    );
  });

  allGoodPausedModeReadable.on('end', () => {
    console.error('allGoodPausedModeReadable event fired: end');
  });

  allGoodPausedModeReadable.on('error', (err) => {
    console.error('allGoodPausedModeReadable event fired: error', err);
  });

  allGoodPausedModeReadable.on('readable', () => {
    console.error(
      'allGoodPausedModeReadable event fired: readable',
      'allGoodPausedModeReadable.readableLength', allGoodPausedModeReadable.readableLength,
      'allGoodPausedModeReadable.readableFlowing', allGoodPausedModeReadable.readableFlowing
    );

    const sizeToRead = 3;
    let chunk;
    while ( null !== (chunk = allGoodPausedModeReadable.read(sizeToRead)) ) {
      console.error(
        'allGoodPausedModeReadable readable event',
        'chunk', chunk,
        'chunk.toString()', chunk?.toString(),
        'allGoodPausedModeReadable.readableLength', allGoodPausedModeReadable.readableLength
      );
      allGoodPausedModeReadableStorage.push(chunk);
    }
  });

  // for await (const chunk of allGoodPausedModeReadable) {
  //     console.error(
  //       'allGoodPausedModeReadable AWAIT chunk', chunk,
  //       'chunk.toString()', chunk?.toString()
  //     );
  // }
}
