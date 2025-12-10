import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { Express } from 'express';

import env from '../../config/env';

const MEDIA_DIR = path.resolve(process.cwd(), 'storage', 'media');

export class LocalStorageProvider {
  async save(file: Express.Multer.File) {
    await fs.mkdir(MEDIA_DIR, { recursive: true });
    const extension = path.extname(file.originalname);
    const filename = `${randomUUID()}${extension}`;
    const destination = path.join(MEDIA_DIR, filename);

    await fs.rename(file.path, destination);

    const relativePath = `/static/media/${filename}`;
    // Usar URL do backend exposta (BACKEND_URL) ou APP_URL; por último localhost:3333
    const backendUrl =
      process.env.BACKEND_URL ||
      process.env.APP_URL ||
      'http://localhost:3333';
    const fileUrl = `${backendUrl}${relativePath}`;

    return {
      fileUrl,
      storageKey: filename,
      relativePath,
    };
  }

  async delete(storageKey: string) {
    const filePath = path.join(MEDIA_DIR, storageKey);
    await fs.rm(filePath, { force: true });
  }

  getAbsolutePath(storageKey: string) {
    return path.join(MEDIA_DIR, storageKey);
  }
}

export default new LocalStorageProvider();

