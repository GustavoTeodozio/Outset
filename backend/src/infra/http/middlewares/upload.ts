import fs from 'fs';
import path from 'path';
import multer from 'multer';

const TMP_DIR = path.resolve(process.cwd(), 'tmp', 'uploads');

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

export const upload = multer({ dest: TMP_DIR });

export default upload;

