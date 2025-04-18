import { Response, NextFunction } from 'express'
import { BusinessServiceService } from '../services/businessServices-service'
import { AuthenticatedRequest } from '../middlewares/authenticateMiddleware'

const service = new BusinessServiceService()

export class BusinessServiceHandler {
  async createService(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, price, duration, description, businessId } = req.body

      if (!businessId) {
        res.status(400).json({ message: 'businessId gerekli' })
        return
      }

      const serviceCreated = await service.createService({
        businessId,
        name,
        price,
        duration,
        description
      })

      res.status(201).json({
        message: 'Hizmet başarıyla oluşturuldu',
        service: serviceCreated
      })
    } catch (error) {
      next(error)
    }
  }

  async getServicesByBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { businessId } = req.params
      const services = await service.getServicesByBusiness(businessId)
      res.status(200).json(services)
    } catch (error) {
      next(error)
    }
  }

  async getServiceById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const serviceDetail = await service.getServiceById(id)

      if (!serviceDetail) {
        res.status(404).json({ message: 'Hizmet bulunamadı' })
        return
      }

      res.status(200).json(serviceDetail)
    } catch (error) {
      next(error)
    }
  }

  async updateService(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const updateData = req.body

      const updated = await service.updateService(id, updateData)

      res.status(200).json({
        message: 'Hizmet başarıyla güncellendi',
        updated
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteService(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      await service.deleteService(id)

      res.status(200).json({ message: 'Hizmet başarıyla silindi' })
    } catch (error) {
      next(error)
    }
  }
}
