import { Writable } from 'stream';
import { writeFile } from 'fs';
import { join } from 'node:path';

let writevAttempt = 0;

export class ImageWriteStream extends Writable {

  #dataStorage = [];

  constructor(options, { silent = false, extname = '' } = {}) {
    super({
      highWaterMark: options.highWaterMark ?? 1000
    });
    this.silent = silent;
    this.extname = extname;
  }

  _construct(callback) {
    console.log('createImageStream construct', 'this.writableHighWaterMark', this.writableHighWaterMark);
    callback();
  }

  _write(chunk, encoding, callback) {
    console.log(
      'createImageStream write',
      ...(
        this.silent
          ? []
          : ['chunk', chunk, 'chunk.toString()', chunk.toString()]
      ),
      'encoding', encoding,
      'chunk.byteLength', chunk.byteLength,
      'chunk.length', chunk.length,
      'this.writableLength', this.writableLength
    );

    this.#dataStorage.push(...chunk);
    callback(null);
  }

  x_writev(chunks, callback) {
    const willCallCb = !(writevAttempt % 2);
    console.log(
      'createImageStream writeV', 'chunks', chunks,
      'chunks.map(({chunk}) => chunk.toString())', chunks.map(({ chunk }) => chunk.toString()),
      'willCallCb', willCallCb,
      'callback', callback,
      'this.writableLength', this.writableLength
    );

    this.#dataStorage.push(...chunks.map(({ chunk }) => chunk));
    chunks.forEach(({ callback }) => callback?.(null));
    chunks.forEach(
      (chunk, index) => chunk.callback = () => console.log('fake cb for', index)
    );

    if (willCallCb) {
      callback();
    }
  }

  _final(callback) {

    // throw new Error('Handmade Error');
    const dataToWrite = Buffer.from(this.#dataStorage);
    console.log(
      'createImageStream final',
      'this.writableLength', this.writableLength,
      'dataToWrite.byteLength', dataToWrite.byteLength,
      'dataToWrite.byteOffset', dataToWrite.byteOffset,
      ...(
        this.silent
          ? []
          : ['dataToWrite', dataToWrite]
      ),
    );
    writeFile(
      join(process.cwd(), `output_${Date.now()}.file${this.extname}`),
      dataToWrite,
      (err) => {
        console.log('createImageStream final writeFile cb. err', err);
        callback(err);
      }
    )

  }

  getDataStorage() {
    return this.#dataStorage;
  }
}
