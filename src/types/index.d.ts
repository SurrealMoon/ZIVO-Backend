import { Multer } from 'multer';
import { RequestUser } from './user'; // path'e göre güncelle

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
      files?: Multer.File[];
      user?: RequestUser;
    }
  }
}
