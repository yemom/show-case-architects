import multer from 'multer';
import fs from 'fs';
import path from 'path';

const ensureDir = p => { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const base = path.join(process.cwd(), 'uploads');
    const folder = file.mimetype.startsWith('video') ? 'videos' : 'images';
    const dest = path.join(base, folder);
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    cb(null, Date.now() + '-' + file.fieldname + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) return cb(null, true);
  cb(new Error('Unsupported file type'));
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});