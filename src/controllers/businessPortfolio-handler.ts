// src/controllers/businessPortfolio-handler.ts
import { Response, NextFunction } from 'express'
import { BusinessPortfolioService } from '../services/businessPortfolio-service'
import { AuthenticatedRequest } from '../middlewares/authenticateMiddleware'

const service = new BusinessPortfolioService()

export class BusinessPortfolioHandler {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { businessId, mediaUrl, mediaType } = req.body

      if (!businessId || !mediaUrl || !mediaType) {
        res.status(400).json({ error: 'Tüm alanlar zorunludur' })
        return
      }

      const created = await service.create(businessId, mediaUrl, mediaType)
      res.status(201).json({ message: 'Portfolyo medyası eklendi', portfolio: created })
    } catch (error) {
      next(error)
    }
  }

  async getByBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { businessId } = req.params
      const list = await service.getByBusiness(businessId)
      res.status(200).json(list)
    } catch (error) {
      next(error)
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const item = await service.getById(id)
      res.status(200).json(item)
    } catch (error) {
      next(error)
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { mediaUrl, mediaType } = req.body

      const updated = await service.update(id, mediaUrl, mediaType)
      res.status(200).json({ message: 'Portfolyo güncellendi', portfolio: updated })
    } catch (error) {
      next(error)
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      await service.delete(id)
      res.status(200).json({ message: 'Portfolyo silindi' })
    } catch (error) {
      next(error)
    }
  }
}
