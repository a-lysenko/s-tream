import { Readable } from "stream";

export async function run() {

  const allGoodFlowModeReadableSource = Array.from(
    new Array(5),
    (_, index) => `item_#${index}`
  );

  let lastReadItemIndex = -1;

  const allGoodFlowModeReadable = new Readable({
    highWaterMark: 12,

    construct(callback) {
      console.log(
        'allGoodFlowModeReadable construct', 'this.readableHighWaterMark', this.readableHighWaterMark,
        'this.readableLength', this.readableLength,
        'this.readableFlowing', this.readableFlowing,
        'this.readable', this.readable
      );
      callback();
    },

    read(size) {
      console.log(
        'allGoodFlowModeReadable read', 'size', size,
        'allGoodFlowModeReadable.readableLength', allGoodFlowModeReadable.readableLength
      );

      if (++lastReadItemIndex < allGoodFlowModeReadableSource.length) {
        const dataToPush = allGoodFlowModeReadableSource[lastReadItemIndex];
        const pushResult = this.push(dataToPush);

        console.log(
          'allGoodFlowModeReadable read', 'pushResult', pushResult,
          'for lastReadItemIndex', lastReadItemIndex,
          'dataToPush', dataToPush,
          'allGoodFlowModeReadable.readableLength', allGoodFlowModeReadable.readableLength,
        );
      } else {
        console.log(
          'allGoodFlowModeReadable read null-push',
          'allGoodFlowModeReadable.readableLength', allGoodFlowModeReadable.readableLength
        );
        const pushResult = this.push(null);
        console.log(
          'allGoodFlowModeReadable read null-push result', pushResult,
          'allGoodFlowModeReadable.readableLength', allGoodFlowModeReadable.readableLength,
        );
      }

    },

    destroy(err, callback) {
      console.log(
        'allGoodFlowModeReadable destroy',
        'this.readableLength', this.readableLength,
        'err', err, 'callback', callback
      );
      callback();
    }
  });

  const allGoodFlowModeReadableStorage = [];

  allGoodFlowModeReadable.on('close', () => {
    console.error(
      'allGoodFlowModeReadable event fired: close',
      'allGoodFlowModeReadableStorage', allGoodFlowModeReadableStorage
    );
  });

  allGoodFlowModeReadable.on('end', () => {
    console.error('allGoodFlowModeReadable event fired: end');
  });

  allGoodFlowModeReadable.on('error', (err) => {
    console.error('allGoodFlowModeReadable event fired: error', err);
  });

  allGoodFlowModeReadable.on('data', (chunk) => {
    console.error(
      'allGoodFlowModeReadable event fired: data'.toUpperCase(),
      'chunk', chunk,
      'chunk.toString()', chunk?.toString(),
      'allGoodFlowModeReadable.readableLength', allGoodFlowModeReadable.readableLength,
      'allGoodFlowModeReadable.readableFlowing', allGoodFlowModeReadable.readableFlowing,
      'allGoodFlowModeReadable.readable', allGoodFlowModeReadable.readable
    );

    allGoodFlowModeReadableStorage.push(chunk);
  });
}
