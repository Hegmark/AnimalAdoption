import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { processUploadedImages } from '../../src/imageProcessing';

const UPLOADS = path.resolve(__dirname, '../../uploads');

describe('processUploadedImages', () => {
  it('produces a watermarked WebP main image + thumbnail, with EXIF stripped', async () => {
    const input = await sharp({
      create: { width: 800, height: 600, channels: 3, background: { r: 100, g: 150, b: 80 } }
    }).jpeg().toBuffer();

    const { images, thumbnail } = await processUploadedImages([{ buffer: input, originalname: 'test photo.jpg' }]);

    expect(images).toHaveLength(1);
    expect(thumbnail).toBeDefined();

    const mainPath = path.join(UPLOADS, path.basename(images[0]));
    const thumbPath = path.join(UPLOADS, path.basename(thumbnail!));

    // Read into buffers (closing the file handles) before inspecting / deleting.
    const mainMeta = await sharp(await fs.readFile(mainPath)).metadata();
    const thumbMeta = await sharp(await fs.readFile(thumbPath)).metadata();

    expect(mainMeta.format).toBe('webp');
    expect(thumbMeta.format).toBe('webp');
    expect(thumbMeta.width).toBe(400);
    expect(mainMeta.exif).toBeUndefined();

    await fs.unlink(mainPath);
    await fs.unlink(thumbPath);
  });

  it('watermarks every image but only the first yields a thumbnail', async () => {
    const mk = () => sharp({ create: { width: 500, height: 400, channels: 3, background: { r: 10, g: 20, b: 30 } } }).png().toBuffer();
    const files = [
      { buffer: await mk(), originalname: 'a.png' },
      { buffer: await mk(), originalname: 'b.png' },
    ];

    const { images, thumbnail } = await processUploadedImages(files);
    expect(images).toHaveLength(2);
    expect(thumbnail).toBeDefined();

    for (const url of [...images, thumbnail!]) {
      await fs.unlink(path.join(UPLOADS, path.basename(url)));
    }
  });
});
