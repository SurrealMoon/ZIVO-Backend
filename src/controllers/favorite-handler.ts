import { Response, NextFunction } from 'express'
import { FavoriteService } from '../services/favorite-service'
import { AuthenticatedRequest } from '../middlewares/authenticateMiddleware'

const favoriteService = new FavoriteService()

export class FavoriteHandler {
  // Favori ekle
  async addFavorite(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        res.status(401).json({ message: 'Yetkisiz erişim' })
        return
      }

      const { businessId } = req.body
      if (!businessId) {
        res.status(400).json({ message: 'businessId zorunludur' })
        return
      }

      const favorite = await favoriteService.addFavorite(userId, businessId)

      res.status(201).json({
        message: 'Favori başarıyla eklendi',
        favorite
      })
    } catch (error) {
      next(error)
    }
  }

  // Favorileri getir
  async getFavorites(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        res.status(401).json({ message: 'Yetkisiz erişim' })
        return
      }

      const favorites = await favoriteService.getFavorites(userId)
      res.status(200).json(favorites)
    } catch (error) {
      next(error)
    }
  }

  // Favori sil (ID üzerinden)
  async removeFavoriteById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      await favoriteService.removeFavoriteById(id)

      res.status(200).json({ message: 'Favori başarıyla silindi' })
    } catch (error) {
      next(error)
    }
  }

  // Favori sil (userId + businessId)
  async removeFavoriteByBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      const { businessId } = req.params

      if (!userId) {
        res.status(401).json({ message: 'Yetkisiz erişim' })
        return
      }

      await favoriteService.removeFavoriteByBusiness(userId, businessId)

      res.status(200).json({ message: 'Favori (businessId ile) başarıyla silindi' })
    } catch (error) {
      next(error)
    }
  }
}
