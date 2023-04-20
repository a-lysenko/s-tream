import { Writable } from "stream";

export function run() {
  const allGoodWritableSource = Array.from(
    new Array(5),
    (_, index) => `item_#${index}`
  );
  const allGoodWritableStorage = [];
  const allGoodWritable = new Writable(
    {
      highWaterMark: 101,
      construct(callback) {
        console.log('allGoodWritable construct', 'this.writableHighWaterMark', this.writableHighWaterMark);
        callback();
      },
      write(chunk, encoding, callback) {
        console.log(
          'allGoodWritable write', 'chunk', chunk, 'chunk.toString()', chunk.toString(),
          'encoding', encoding,
          'this.writableLength', this.writableLength
        );

        allGoodWritableStorage.push(chunk.toString());
        callback(null);
      },
      final(callback) {
        console.log('allGoodWritable final', 'this.writableLength', this.writableLength);
        callback();
      }
    }
  );

  allGoodWritable.on('close', () => {
    console.error('allGoodWritable event fired: close');
  });

  allGoodWritable.on('finish', () => {
    console.error('allGoodWritable event fired: finish');
  });

  allGoodWritableSource.forEach(
    (elem, index) => {
      const writeResult = allGoodWritable.write(elem, 'utf-8', () => {
        console.log(
          'allGoodWritable write cb. created on index', index, 'for elem', elem,
          'writableStream.writableLength', allGoodWritable.writableLength
        );
      });

      console.log(
        'allGoodWritable writeResult', writeResult, 'on index', index, 'for elem', elem,
        'allGoodWritable.writableLength', allGoodWritable.writableLength
      );
    }
  );

  allGoodWritable.end(
    'end-chunk',
    (...args) => {
      console.log(
        'allGoodWritable.end cb. args', args,
        'writableStream.writableLength', allGoodWritable.writableLength,
        'allGoodWritableStorage', allGoodWritableStorage
      );
    }
  );

  setTimeout(
    () => {
      console.log('In allGoodWritable setTimeout(2000) allGoodWritableStorage', allGoodWritableStorage);
    },
    2000
  );
}
