import { Response, NextFunction } from 'express'
import { BusinessReviewService } from '../services/businessReviews-service'
import { AuthenticatedRequest } from '../middlewares/authenticateMiddleware'

const service = new BusinessReviewService()

export class BusinessReviewHandler {
  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { businessId, content, imageUrl } = req.body
      const userId = req.userId!

      if (!businessId || !content) {
        res.status(400).json({ error: 'businessId ve content zorunludur.' })
        return
      }

      const review = await service.create(userId, businessId, content, imageUrl)
      res.status(201).json({
        message: 'Yorum başarıyla oluşturuldu',
        review,
      })
    } catch (error) {
      next(error)
    }
  }

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const { content, imageUrl } = req.body
      const userId = req.userId!
      const userRoles = req.roles || []
  
      if (!content) {
        res.status(400).json({ error: 'content zorunludur.' })
        return
      }
  
      const existing = await service.getReviewById(id)
  
      if (!existing) {
        res.status(404).json({ error: 'Yorum bulunamadı' })
        return
      }
  
      if (existing.userId !== userId && !userRoles.includes('admin') && !userRoles.includes('super_admin')) {
        res.status(403).json({ error: 'Bu yorumu güncelleme yetkiniz yok.' })
        return
      }
  
      const updated = await service.updateById(id, content, imageUrl)
  
      res.status(200).json({
        message: 'Yorum güncellendi',
        review: updated,
      })
    } catch (error) {
      next(error)
    }
  }
  
  delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const userId = req.userId!
      const userRoles = req.roles || []
  
      const existing = await service.getReviewById(id)
  
      if (!existing) {
        res.status(404).json({ error: 'Yorum bulunamadı' })
        return
      }
  
      // Eğer yorum sahibi değilse ve admin/super_admin değilse → yetkisiz
      if (existing.userId !== userId && !userRoles.includes('admin') && !userRoles.includes('super_admin')) {
        res.status(403).json({ error: 'Bu yorumu silme yetkiniz yok.' })
        return
      }
  
      await service.deleteById(id)
  
      res.status(200).json({ message: 'Yorum silindi' })
    } catch (error) {
      next(error)
    }
  }

  getByBusiness = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { businessId } = req.params
      const reviews = await service.getReviewsByBusiness(businessId)

      res.status(200).json(reviews)
    } catch (error) {
      next(error)
    }
  }
}
