import { RequestUser } from './user'; // path'e göre güncelle

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export {};
