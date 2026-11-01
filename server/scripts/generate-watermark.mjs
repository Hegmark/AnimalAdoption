// Renders assets/watermark.svg -> assets/watermark.png so the runtime can
// composite a watermark without needing fonts installed in the container.
// Regenerate with:  npm run watermark
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../assets');
const svg = fs.readFileSync(path.join(dir, 'watermark.svg'));

await sharp(svg).png().toFile(path.join(dir, 'watermark.png'));
console.log('Wrote assets/watermark.png');
