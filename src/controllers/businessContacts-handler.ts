import { Response, NextFunction } from 'express'
import { BusinessContactService } from '../services/businessContacts-service'
import { AuthenticatedRequest } from '../middlewares/authenticateMiddleware'

const service = new BusinessContactService()

export class BusinessContactHandler {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { businessId, contactType, contactValue } = req.body

      if (!businessId || !contactType || !contactValue) {
        res.status(400).json({ error: 'Tüm alanlar zorunludur' })
        return
      }

      const contact = await service.create(businessId, contactType, contactValue)
      res.status(201).json({ message: 'İletişim bilgisi eklendi', contact })
    } catch (error) {
      next(error)
    }
  }

  async getByBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { businessId } = req.params
      const contacts = await service.getByBusiness(businessId)
      res.status(200).json(contacts)
    } catch (error) {
      next(error)
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { contactType, contactValue } = req.body

      const updated = await service.update(id, contactType, contactValue)
      res.status(200).json({ message: 'İletişim bilgisi güncellendi', contact: updated })
    } catch (error) {
      next(error)
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      await service.delete(id)
      res.status(200).json({ message: 'İletişim bilgisi silindi' })
    } catch (error) {
      next(error)
    }
  }
}
