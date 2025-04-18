import { Response, NextFunction } from 'express'
import { ProfileService } from '../services/profile-service'
import { AuthenticatedRequest } from '../middlewares/authenticateMiddleware'

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

      const updateData = req.body

      const updatedProfile = await profileService.updateMyProfile(userId, updateData)

      res.status(200).json({
        message: 'Profil güncellendi',
        profile: updatedProfile,
      })
    } catch (error) {
      next(error)
    }
  }
}
