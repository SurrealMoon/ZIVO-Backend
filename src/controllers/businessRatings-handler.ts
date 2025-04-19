import { Response, NextFunction } from 'express'
import { BusinessRatingService } from '../services/businessRatings-service'
import { AuthenticatedRequest } from '../middlewares/authenticateMiddleware'

const service = new BusinessRatingService()

export class BusinessRatingHandler {
  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { businessId, rating } = req.body
      const userId = req.userId!

      if (!businessId || rating == null) {
        res.status(400).json({ error: 'businessId ve rating zorunludur' })
        return
      }

      const created = await service.create(userId, businessId, rating)

      res.status(201).json({
        message: 'Puan başarıyla eklendi',
        rating: created,
      })
    } catch (error) {
      next(error)
    }
  }

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { businessId, rating } = req.body
      const userId = req.userId!

      if (!businessId || rating == null) {
        res.status(400).json({ error: 'businessId ve rating zorunludur' })
        return
      }

      const updated = await service.update(userId, businessId, rating)

      res.status(200).json({
        message: 'Puan güncellendi',
        rating: updated,
      })
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { businessId } = req.params
      const userId = req.userId!

      await service.delete(userId, businessId)

      res.status(200).json({ message: 'Puan silindi' })
    } catch (error) {
      next(error)
    }
  }

  getByBusiness = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { businessId } = req.params
      const ratings = await service.getRatingsByBusiness(businessId)

      res.status(200).json(ratings)
    } catch (error) {
      next(error)
    }
  }

  getSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { businessId } = req.params
      const summary = await service.getRatingSummary(businessId)

      res.status(200).json(summary)
    } catch (error) {
      next(error)
    }
  }
}
