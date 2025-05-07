import { Request, Response, NextFunction } from 'express'
import { getPresignedPhotoUrl } from '../utils/s3-utils'

export class MediaHandler {
  async getPhotoUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { key } = req.query

      if (!key || typeof key !== 'string') {
        res.status(400).json({ error: 'Geçerli bir photoKey belirtilmeli' })
        return
      }

      const signedUrl = await getPresignedPhotoUrl(key)
      res.status(200).json({ url: signedUrl })
    } catch (error) {
      next(error)
    }
  }
}
