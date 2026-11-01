import multer from 'multer';

// Keep the uploaded file in memory so it can be processed (resized, watermarked,
// re-encoded) before anything is written to disk. See imageProcessing.ts.
export const upload = multer({ storage: multer.memoryStorage() });
