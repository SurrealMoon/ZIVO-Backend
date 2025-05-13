import { Request, Response, NextFunction } from 'express'
import { getPresignedPhotoUrl } from '../utils/s3-utils'

export class MediaHandler {
  async getPhotoUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { key } = req.query;

      if (!key || typeof key !== 'string' || key.trim() === '') {
        res.status(400).json({ error: 'Geçerli bir photoKey belirtilmeli' });
        return;
      }

      console.log(`Presigned URL isteniyor → ${key}`);

      const signedUrl = await getPresignedPhotoUrl(key);

      res.status(200).json({ url: signedUrl });
    } catch (error) {
      console.error('Presigned URL alınırken hata:', error);
      next(error);
    }
  }
}
