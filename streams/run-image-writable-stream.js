import { ImageWriteStream } from './writable-streams/create-image-writable-stream.js';
import { createReadStream } from 'fs';
import { join, extname } from 'node:path';

export function runWithImage() {
  const imageRelPath = 'streams/writable-streams/test-image.jpg';

  const imageReadStream = createReadStream(
    join(process.cwd(), imageRelPath),
    { highWaterMark: 2000 }
  );

  imageReadStream.on('close', () => {
    console.error('imageReadStream event fired: close');
  });

  imageReadStream.on('end', () => {
    console.error('imageReadStream event fired: end');
  });

  imageReadStream.on('error', (err) => {
    console.error('imageReadStream event fired: error', err);
  });

  imageReadStream.on('open', () => {
    console.error('imageReadStream event fired: open');
  });

  const imageWriteStream = new ImageWriteStream(
    { highWaterMark: 1000 },
    { silent: true, extname: extname(imageRelPath) }
  );
  imageWriteStream.on('close', () => {
    console.error('imageWriteStream event fired: close');
  });

  imageWriteStream.on('finish', () => {
    console.error('imageWriteStream event fired: finish');
  });

  imageWriteStream.on('error', (err) => {
    console.error('imageWriteStream event fired: error', err);
  });

  imageWriteStream.on('drain', () => {
    console.error('imageWriteStream event fired: drain'.toUpperCase());
  });

  imageWriteStream.on('pipe', () => {
    console.error('imageWriteStream event fired: pipe'.toUpperCase());
  });

  imageWriteStream.on('unpipe', () => {
    console.error('imageWriteStream event fired: unpipe'.toUpperCase());
  });

  imageReadStream.pipe(imageWriteStream);
}
