import { Writable } from "stream";

export function run() {
  const noWCallbackWritableSource = Array.from(
    new Array(5),
    (_, index) => `item_#${index}`
  );
  const noWCallbackWritableStorage = [];
  let noWCallbackWritableChunkIndex = 0;
  const noWCallbackWritable = new Writable(
    {
      highWaterMark: 101,
      construct(callback) {
        console.log('noWCallbackWritable construct', 'this.writableHighWaterMark', this.writableHighWaterMark);
        callback();
      },
      write(chunk, encoding, callback) {
        const willIgnoreCb = noWCallbackWritableChunkIndex === 2;
        console.log(
          'noWCallbackWritable write', 'chunk', chunk, 'chunk.toString()', chunk.toString(),
          'encoding', encoding,
          'noWCallbackWritableChunkIndex', noWCallbackWritableChunkIndex,
          'willIgnoreCb', willIgnoreCb,
          'this.writableLength', this.writableLength
        );

        noWCallbackWritableStorage.push(chunk.toString());

        if (!willIgnoreCb) {
          noWCallbackWritableChunkIndex++;
          callback(null);
        } else {
          console.log('noWCallbackWritable write. I will ignore cb for', chunk.toString(), ':');
        }

      },
      final(callback) {
        console.log('noWCallbackWritable final', 'this.writableLength', this.writableLength);
        callback();
      }
    }
  );

  noWCallbackWritable.on('close', () => {
    console.error('noWCallbackWritable event fired: close');
  });

  noWCallbackWritable.on('finish', () => {
    console.error('noWCallbackWritable event fired: finish');
  });

  noWCallbackWritableSource.forEach(
    (elem, index) => {
      const writeResult = noWCallbackWritable.write(elem, 'utf-8', (...args) => {
        console.log(
          'noWCallbackWritable write cb. created on index', index, 'for elem', elem, 'final args', args,
          'writableStream.writableLength', noWCallbackWritable.writableLength
        );
      });

      console.log(
        'noWCallbackWritable writeResult', writeResult, 'on index', index, 'for elem', elem,
        'noWCallbackWritable.writableLength', noWCallbackWritable.writableLength
      );
    }
  );

  noWCallbackWritable.end(
    'end-chunk',
    (...args) => {
      console.log(
        'noWCallbackWritable.end cb. args', args,
        'writableStream.writableLength', noWCallbackWritable.writableLength,
        'noWCallbackWritableStorage', noWCallbackWritableStorage
      );
    }
  );

  setTimeout(
    () => {
      console.log('In noWCallbackWritable setTimeout(2000) noWCallbackWritableStorage', noWCallbackWritableStorage);
    },
    2000
  );
}
