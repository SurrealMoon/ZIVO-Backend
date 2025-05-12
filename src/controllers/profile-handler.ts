import { Response, NextFunction } from 'express'
import { ProfileService } from '../services/profile-service'
import { AuthenticatedRequest } from '../middlewares/authenticateMiddleware'
import { CustomRequest } from '../types/custom';
import { getPresignedPhotoUrl } from '../utils/s3-utils';


const profileService = new ProfileService()

export class ProfileHandler {
  // Profil oluştur
  async createProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        res.status(401).json({ message: 'Yetkisiz erişim' })
        return
      }

      const { bio, birthDate, avatarUrl } = req.body

      const profile = await profileService.createProfile(userId, {
        bio,
        birthDate,
        avatarUrl,
      })

      res.status(201).json({
        message: 'Profil oluşturuldu',
        profile,
      })
    } catch (error) {
      next(error)
    }
  }

  // Profil getir
  async getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        res.status(401).json({ message: 'Yetkisiz erişim' })
        return
      }

      const profile = await profileService.getMyProfile(userId)
      res.status(200).json(profile)
    } catch (error) {
      next(error)
    }
  }

  // Profil güncelle
async updateMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId
    if (!userId) {
      res.status(401).json({ message: 'Yetkisiz erişim' })
      return
    }

    const { gender, ...profileData } = req.body;

    const updatedProfile = await profileService.updateMyProfile(userId, {
      ...profileData,
      gender,
    });

    res.status(200).json({
      message: 'Profil güncellendi',
      profile: updatedProfile,
    });
  } catch (error) {
    next(error)
  }
}


async uploadPhoto(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Yetkisiz erişim' });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ message: 'Dosya bulunamadı' });
      return;
    }

    console.log('📸 Uploaded file:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      bufferLength: file.buffer ? file.buffer.length : 0,
    });

    const photoKey = await profileService.uploadPhoto(userId, file);

    res.status(200).json({ message: 'Fotoğraf yüklendi', photoKey });
  } catch (error) {
    next(error);
  }
}



  async deletePhoto(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ message: 'Yetkisiz erişim' });
        return;
      }
  
      await profileService.deletePhoto(userId);
  
      res.status(200).json({ message: 'Profil fotoğrafı silindi' });
    } catch (error) {
      next(error);
    }
  }
  
}
