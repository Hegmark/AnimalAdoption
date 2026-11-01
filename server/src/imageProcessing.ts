// Synchronous image processing for animal photos.
// Every uploaded image becomes a watermarked, EXIF-stripped WebP "main" image.
// The first uploaded image additionally yields a non-watermarked square
// thumbnail used as the list/cover image.

import sharp from 'sharp';
import path from 'path';

const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
const WATERMARK_PATH = path.resolve(__dirname, '../assets/watermark.png');

const MAIN_MAX = 1200;   // longest edge of a main image
const THUMB_SIZE = 400;  // square thumbnail edge

export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
}

export interface ProcessedImages {
  images: string[];   // watermarked main images, in upload order
  thumbnail?: string; // non-watermarked thumbnail from the first image
}

// Watermarked WebP main image. rotate() applies EXIF orientation; sharp then
// drops all metadata on output. Returns the /uploads URL.
async function writeWatermarkedMain(buffer: Buffer, fileName: string): Promise<string> {
  const mainBuffer = await sharp(buffer)
    .rotate()
    .resize({ width: MAIN_MAX, height: MAIN_MAX, fit: 'inside', withoutEnlargement: true })
    .toBuffer();

  // Scale the watermark so it never exceeds the (possibly small) main image.
  const meta = await sharp(mainBuffer).metadata();
  const watermarkWidth = Math.max(80, Math.round(Math.min(300, (meta.width ?? 300) * 0.5)));
  const watermark = await sharp(WATERMARK_PATH).resize({ width: watermarkWidth }).toBuffer();

  await sharp(mainBuffer)
    .composite([{ input: watermark, gravity: 'southeast' }])
    .webp({ quality: 80 })
    .toFile(path.join(UPLOADS_DIR, fileName));

  return `/uploads/${fileName}`;
}

// Square, non-watermarked WebP thumbnail. Returns the /uploads URL.
async function writeThumbnail(buffer: Buffer, fileName: string): Promise<string> {
  await sharp(buffer)
    .rotate()
    .resize({ width: THUMB_SIZE, height: THUMB_SIZE, fit: 'cover' })
    .webp({ quality: 70 })
    .toFile(path.join(UPLOADS_DIR, fileName));

  return `/uploads/${fileName}`;
}

// Process one or more uploaded images. Every image becomes a watermarked main;
// the first image also produces the non-watermarked list thumbnail.
export async function processUploadedImages(files: UploadedFile[]): Promise<ProcessedImages> {
  const images: string[] = [];
  let thumbnail: string | undefined;

  for (let i = 0; i < files.length; i++) {
    const safeName = path.parse(files[i].originalname).name.replace(/\s+/g, '_');
    const baseName = `${Date.now()}-${i}-${safeName}`;

    images.push(await writeWatermarkedMain(files[i].buffer, `${baseName}.webp`));
    if (i === 0) {
      thumbnail = await writeThumbnail(files[i].buffer, `${baseName}-thumb.webp`);
    }
  }

  return { images, thumbnail };
}
