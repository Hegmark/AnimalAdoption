// Synchronous image processing for animal photos.
// On upload we: auto-orient from EXIF then strip metadata, produce a
// watermarked main image and a square thumbnail, both as compressed WebP.

import sharp from 'sharp';
import path from 'path';

const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
const WATERMARK_PATH = path.resolve(__dirname, '../assets/watermark.png');

const MAIN_MAX = 1200;   // longest edge of the main image
const THUMB_SIZE = 400;  // square thumbnail edge

export interface ProcessedImage {
  main: string;      // URL path to the watermarked main image
  thumbnail: string; // URL path to the thumbnail
}

export async function processAnimalImage(buffer: Buffer, baseName: string): Promise<ProcessedImage> {
  const mainName = `${baseName}.webp`;
  const thumbName = `${baseName}-thumb.webp`;

  // rotate() with no argument applies the EXIF orientation; sharp then drops all
  // metadata (EXIF, GPS, ...) on output unless withMetadata() is used.
  const normalized = sharp(buffer).rotate();

  // --- main image: fit within MAIN_MAX, watermark bottom-right, WebP ---
  const mainBuffer = await normalized
    .clone()
    .resize({ width: MAIN_MAX, height: MAIN_MAX, fit: 'inside', withoutEnlargement: true })
    .toBuffer();

  // Scale the watermark so it never exceeds the (possibly small) main image.
  const mainMeta = await sharp(mainBuffer).metadata();
  const watermarkWidth = Math.max(80, Math.round(Math.min(300, (mainMeta.width ?? 300) * 0.5)));
  const watermark = await sharp(WATERMARK_PATH).resize({ width: watermarkWidth }).toBuffer();

  await sharp(mainBuffer)
    .composite([{ input: watermark, gravity: 'southeast' }])
    .webp({ quality: 80 })
    .toFile(path.join(UPLOADS_DIR, mainName));

  // --- thumbnail: square cover crop, smaller WebP (no watermark) ---
  await normalized
    .clone()
    .resize({ width: THUMB_SIZE, height: THUMB_SIZE, fit: 'cover' })
    .webp({ quality: 70 })
    .toFile(path.join(UPLOADS_DIR, thumbName));

  return {
    main: `/uploads/${mainName}`,
    thumbnail: `/uploads/${thumbName}`
  };
}
