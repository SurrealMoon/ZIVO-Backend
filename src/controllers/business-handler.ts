import { Response, NextFunction } from 'express'
import { BusinessService } from '../services/business-service'
import { AuthenticatedRequest } from '../middlewares/authenticateMiddleware'

const businessService = new BusinessService()

export class BusinessHandler {
  // 🔹 Mağaza oluştur
  async createBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, roles } = req

      if (!userId || !roles?.includes('store_owner')) {
        res.status(403).json({ message: 'Sadece işletme sahipleri mağaza oluşturabilir' })
        return
      }

      const data = req.body
      const business = await businessService.createBusiness(userId, data)

      res.status(201).json({
        message: 'Mağaza başarıyla oluşturuldu',
        business
      })
    } catch (error) {
      next(error)
    }
  }

  // 🔹 Tek mağaza getir
  async getBusinessById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const business = await businessService.getBusinessById(id)

      if (!business) {
        res.status(404).json({ message: 'Mağaza bulunamadı' })
        return
      }

      res.status(200).json(business)
    } catch (error) {
      next(error)
    }
  }

  // 🔹 Tüm mağazaları getir
  async getAllBusinesses(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const businesses = await businessService.getAllBusinesses()
      res.status(200).json(businesses)
    } catch (error) {
      next(error)
    }
  }

  // 🔹 Mağaza güncelle
  async updateBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const data = req.body

      const updated = await businessService.updateBusiness(id, data)

      res.status(200).json({
        message: 'Mağaza başarıyla güncellendi',
        business: updated
      })
    } catch (error) {
      next(error)
    }
  }

  // 🔹 Mağaza sil (soft delete)
  async deleteBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { userId } = req

      await businessService.deleteBusiness(id, userId!)

      res.status(200).json({ message: 'Mağaza başarıyla silindi' })
    } catch (error) {
      next(error)
    }
  }
    // Kapak görseli yükleme
    async uploadCoverImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const { id: businessId } = req.params;
        const file = req.file
  
        if (!file) {
          res.status(400).json({ error: 'Dosya yüklenmedi' })
          return
        }
  
        const photoKey = await businessService.uploadCoverImage(businessId, file)
  
        res.status(200).json({
          message: 'Kapak görseli başarıyla yüklendi',
          photoKey,
        })
      } catch (error) {
        next(error)
      }
    }
  
    // Kapak görseli silme
    async deleteCoverImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const { id: businessId } = req.params;
  
        await businessService.deleteCoverImage(businessId)
  
        res.status(200).json({ message: 'Kapak görseli silindi' })
      } catch (error) {
        next(error)
      }
    }
  }
