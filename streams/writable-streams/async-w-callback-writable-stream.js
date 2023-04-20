import { Writable } from "stream";

export function run() {
  const asyncWCallbackWritableSource = Array.from(
    new Array(5),
    (_, index) => `item_#${index}`
  );
  const asyncWCallbackWritableStorage = [];
  let asyncWCallbackWritableChunkIndex = 0;
  const asyncWCallbackWritable = new Writable(
    {
      highWaterMark: 101,
      construct(callback) {
        console.log('asyncWCallbackWritable construct', 'this.writableHighWaterMark', this.writableHighWaterMark);
        callback();
      },
      write(chunk, encoding, callback) {
        const willPostponeCallback = (asyncWCallbackWritableChunkIndex === 1);
        console.log(
          'asyncWCallbackWritable write', 'chunk', chunk, 'chunk.toString()', chunk.toString(),
          'encoding', encoding,
          'asyncWCallbackWritableChunkIndex', asyncWCallbackWritableChunkIndex,
          'willPostponeCallback', willPostponeCallback,
          'this.writableLength', this.writableLength
        );

        asyncWCallbackWritableStorage.push(chunk.toString());

        if (willPostponeCallback) {
          const postponeDelay = 4000;
          console.log('asyncWCallbackWritable write callback will be postponed', postponeDelay, 'ms for', asyncWCallbackWritableChunkIndex);

          asyncWCallbackWritableChunkIndex++;
          setTimeout(
            () => {
              console.log('asyncWCallbackWritable write. Now I will execute the postponed cb for', chunk.toString(), ':');
              callback(null);
            },
            postponeDelay
          );
        } else {
          asyncWCallbackWritableChunkIndex++;
          callback(null);
        }
      },
      final(callback) {
        console.log('asyncWCallbackWritable final', 'this.writableLength', this.writableLength);
        callback();
      }
    }
  );

  asyncWCallbackWritable.on('close', () => {
    console.error('asyncWCallbackWritable event fired: close');
  });

  asyncWCallbackWritable.on('finish', () => {
    console.error('asyncWCallbackWritable event fired: finish');
  });

  asyncWCallbackWritableSource.forEach(
    (elem, index) => {
      const writeResult = asyncWCallbackWritable.write(elem, 'utf-8', () => {
        console.log(
          'asyncWCallbackWritable write cb. created on index', index, 'for elem', elem,
          'writableStream.writableLength', asyncWCallbackWritable.writableLength
        );
      });

      console.log(
        'asyncWCallbackWritable writeResult', writeResult, 'on index', index, 'for elem', elem,
        'asyncWCallbackWritable.writableLength', asyncWCallbackWritable.writableLength
      );
    }
  );

  asyncWCallbackWritable.end(
    'end-chunk',
    (...args) => {
      console.log(
        'asyncWCallbackWritable.end cb. args', args,
        'writableStream.writableLength', asyncWCallbackWritable.writableLength,
        'asyncWCallbackWritableStorage', asyncWCallbackWritableStorage
      );
    }
  );

  setTimeout(
    () => {
      console.log('In asyncWCallbackWritable setTimeout(2000) asyncWCallbackWritableStorage', asyncWCallbackWritableStorage);
    },
    2000
  );
}
