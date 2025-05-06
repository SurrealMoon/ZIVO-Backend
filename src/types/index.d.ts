import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
      files?: Multer.File[];
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}
