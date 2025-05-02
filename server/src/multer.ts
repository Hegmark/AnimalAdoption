import multer from 'multer';
import path from 'path';

const UPLOADS_DIR = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename:    (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g,'_')}`)
});

export const upload = multer({ storage });