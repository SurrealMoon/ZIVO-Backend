import { Response, NextFunction } from 'express'
import { AppointmentService } from '../services/appointments-service'
import { AuthenticatedRequest } from '../middlewares/authenticateMiddleware'

const service = new AppointmentService()

export class AppointmentHandler {
  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { businessId, workerId, date, note, serviceIds } = req.body
      const customerId = req.userId!

      if (!businessId || !date || !serviceIds?.length) {
        res.status(400).json({ error: 'Zorunlu alanlar eksik.' })
        return
      }

      const created = await service.create({ customerId, businessId, workerId, date, note, serviceIds })
      res.status(201).json({ message: 'Randevu oluşturuldu', appointment: created })
    } catch (error) {
      next(error)
    }
  }

  getMine = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!
      const appointments = await service.getByCustomer(userId)
      res.status(200).json(appointments)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const appointment = await service.getById(id)

      if (!appointment) {
        res.status(404).json({ error: 'Randevu bulunamadı' })
        return
      }

      res.status(200).json(appointment)
    } catch (error) {
      next(error)
    }
  }

  cancel = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const userId = req.userId!
      const roles = req.roles || []

      const appointment = await service.getById(id)
      if (!appointment) {
        res.status(404).json({ error: 'Randevu bulunamadı' })
        return
      }

      if (appointment.customerId !== userId && !roles.includes('admin') && !roles.includes('super_admin')) {
        res.status(403).json({ error: 'Bu randevuyu iptal etme yetkiniz yok.' })
        return
      }

      await service.cancelById(id, userId)

      res.status(200).json({ message: 'Randevu iptal edildi' })
    } catch (error) {
      next(error)
    }
  }

  updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const { status } = req.body
      const userRoles = req.roles || []
  
      if (!['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
        res.status(400).json({ error: 'Geçersiz durum değeri.' })
        return
      }
  
      if (!userRoles.includes('admin') && !userRoles.includes('super_admin') && !userRoles.includes('store_owner')) {
        res.status(403).json({ error: 'Randevu durumunu güncelleme yetkiniz yok.' })
        return
      }
  
      const updated = await service.updateStatus(id, status)
  
      res.status(200).json({
        message: 'Randevu durumu güncellendi',
        appointment: updated,
      })
    } catch (error) {
      next(error)
    }
  }
  
}
