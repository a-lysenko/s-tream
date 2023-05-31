import { Readable } from 'stream';

export async function run() {

  const allGoodReadableSource = Array.from(
    new Array(5),
    (_, index) => `item_#${index}`
  );

  let lastReadItemIndex = -1;

  const allGoodReadable = new Readable({
    highWaterMark: 12,

    construct(callback) {
      console.log(
        'allGoodReadable construct', 'this.readableHighWaterMark', this.readableHighWaterMark,
        'this.readableLength', this.readableLength,
        'this.readableFlowing', this.readableFlowing,
        'this.readable', this.readable
      );
      callback();
    },

    read(size) {
      console.log(
        'allGoodReadable read', 'size', size,
        'allGoodReadable.readableLength', allGoodReadable.readableLength
      );

      // while (++lastReadItemIndex < allGoodReadableSource.length) {
      //   const pushResult = this.push(
      //     allGoodReadableSource[lastReadItemIndex]
      //   );
      //
      //   console.log(
      //     'allGoodReadable read', 'pushResult', pushResult,
      //     'for lastReadItemIndex', lastReadItemIndex
      //   );
      // }

      if (++lastReadItemIndex < allGoodReadableSource.length) {
        const dataToPush = allGoodReadableSource[lastReadItemIndex];
        const pushResult = this.push(dataToPush);

        console.log(
          'allGoodReadable read', 'pushResult', pushResult,
          'for lastReadItemIndex', lastReadItemIndex,
          'dataToPush', dataToPush,
          'dataToPush.toString()', dataToPush.toString(),
          'allGoodReadable.readableLength', allGoodReadable.readableLength,
        );
      } else {
        console.log(
          'allGoodReadable read null-push',
          'allGoodReadable.readableLength', allGoodReadable.readableLength
        );
        const pushResult = this.push(null);
        console.log(
          'allGoodReadable read null-push result', pushResult,
          'allGoodReadable.readableLength', allGoodReadable.readableLength,
        );
      }

    },

    destroy(err, callback) {
      console.log(
        'allGoodReadable destroy',
        'this.readableLength', this.readableLength,
        'err', err, 'callback', callback
      );
      callback();
    }
  });

  const allGoodReadableStorage = [];

  allGoodReadable.on('close', () => {
    console.error('allGoodReadable event fired: close');
  });

  allGoodReadable.on('end', () => {
    console.error('allGoodReadable event fired: end');
  });

  allGoodReadable.on('error', (err) => {
    console.error('allGoodReadable event fired: error', err);
  });

  allGoodReadable.on('readable', () => {
    console.error(
      'allGoodReadable event fired: readable',
      'allGoodReadable.readableLength', allGoodReadable.readableLength,
      'allGoodReadable.readableFlowing', allGoodReadable.readableFlowing,
      'allGoodReadable.readable', allGoodReadable.readable
    );

    const chunk = allGoodReadable.read(2);
    console.error(
      'allGoodReadable readable event',
      'chunk', chunk,
      'chunk.toString()', chunk?.toString(),
      'allGoodReadable.readableLength', allGoodReadable.readableLength,
    );

    allGoodReadableStorage.push(chunk);
  });

  // for await (const chunk of allGoodReadable) {
  //     console.error(
  //       'allGoodReadable AWAIT chunk', chunk,
  //       'chunk.toString()', chunk?.toString()
  //     );
  // }

  const finalTimeoutDelay = 10000;
  setTimeout(
    () => {
      console.log(
        'Final timeout', finalTimeoutDelay,
        'allGoodReadableStorage', allGoodReadableStorage
      );
      let chunk;
      while ( chunk = allGoodReadable.read(3) ) {
        console.log(
          'Final timeout pushing',
          'chunk', chunk, 'chunk.toString()', chunk.toString()
        );
        allGoodReadableStorage.push({ value: chunk })
      }

      console.log(
        'Final timeout all written',
        'allGoodReadableStorage'.toUpperCase(), allGoodReadableStorage
      );
    },
    finalTimeoutDelay
  );
}
