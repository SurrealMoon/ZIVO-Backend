import { Request } from 'express';

export interface CustomRequest extends Request {
  file?: Express.Multer.File;
  params: {
    userId: string;
  };
  user?: {
    id: string;
    email: string;
    role: string;
  };
}
