import { Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile-service';
import { AuthenticatedRequest } from '../middlewares/authenticateMiddleware';

const profileService = new ProfileService();

export class ProfileHandler {
  // ✅ Profil oluştur
  async createProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ message: 'Yetkisiz erişim' });
        return;
      }

      const { bio, birthDate, photoKey } = req.body; // avatarUrl yerine photoKey

      const profile = await profileService.createProfile(userId, {
        bio,
        birthDate,
        photoKey, // ✅ doğru alan
      });

      res.status(201).json({
        message: 'Profil oluşturuldu',
        profile,
      });
    } catch (error) {
      next(error);
    }
  }

  // ✅ Profil getir
  async getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Yetkisiz erişim' });
      return;
    }

    const profile = await profileService.getMyProfile(userId);

    if (!profile || !profile.user) {
      res.status(404).json({ message: 'Profil bulunamadı' });
      return;
    }

    // 👇 flatten edilmiş veri yapısı
    res.status(200).json({
      id: profile.user.id,
      email: profile.user.email,
      name: profile.user.name,
      surname: profile.user.surname,
      phone: profile.user.phone,
      gender: profile.user.gender,
      photoKey: profile.user.photoKey,
      profile: {
        id: profile.id,
        userId: profile.userId,
        bio: profile.bio,
        birthDate: profile.birthDate,
        avatarUrl: profile.avatarUrl,
        isProfileComplete: profile.isProfileComplete,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
}


  // ✅ Profil güncelle
  async updateMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ message: 'Yetkisiz erişim' });
        return;
      }

      const { gender, photoKey, ...profileData } = req.body; // avatarUrl yerine photoKey

      const updatedProfile = await profileService.updateMyProfile(userId, {
        ...profileData,
        gender,
        photoKey, // ✅ ekledik
      });

      res.status(200).json({
        message: 'Profil güncellendi',
        profile: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  // ✅ Profil fotoğrafı yükleme
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

  // ✅ Profil fotoğrafı silme
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
