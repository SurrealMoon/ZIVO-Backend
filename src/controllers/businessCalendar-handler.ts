// src/controllers/businessCalendar-handler.ts
import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../middlewares/authenticateMiddleware'
import { BusinessCalendarService } from '../services/businessCalendar-service'

const service = new BusinessCalendarService()

export class BusinessCalendarHandler {
  // 🔹 Yeni takvim günü + shift(ler) oluştur
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { businessId, dayOfWeek, isOpen, note, shifts } = req.body

      if (businessId == null || dayOfWeek == null || isOpen == null) {
        res.status(400).json({ error: 'businessId, dayOfWeek ve isOpen zorunludur' })
        return
      }

      const result = await service.createWithShifts(businessId, dayOfWeek, isOpen, note, shifts)
      res.status(201).json({
        message: 'Takvim günü ve vardiya saatleri başarıyla oluşturuldu',
        calendar: result,
      })
    } catch (error) {
      next(error)
    }
  }

  // 🔹 Mağazanın tüm günlerini getir
  async getByBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { businessId } = req.params
      const result = await service.getByBusiness(businessId)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  // 🔹 Tek bir gün detayı getir
  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const calendar = await service.getById(id)
      res.status(200).json(calendar)
    } catch (error) {
      next(error)
    }
  }

  // 🔹 Günü güncelle (calendar+shift)
  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { isOpen, note, shifts } = req.body
  
      const updated = await service.updateWithShifts(id, isOpen, note, shifts)
  
      res.status(200).json({
        message: 'Takvim günü ve shift bilgileri güncellendi',
        result: updated,
      })
    } catch (error) {
      next(error)
    }
  }  

  // 🔹 Günü sil
  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      await service.delete(id)
      res.status(200).json({ message: 'Takvim günü silindi' })
    } catch (error) {
      next(error)
    }
  }

  // 🔹 Shift ekle
  async createShift(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { calendarId, startTime, endTime } = req.body

      if (!calendarId || !startTime || !endTime) {
        res.status(400).json({ error: 'calendarId, startTime ve endTime zorunludur' })
        return
      }

      const shift = await service.createShift(calendarId, startTime, endTime)
      res.status(201).json({
        message: 'Çalışma saat aralığı eklendi',
        shift,
      })
    } catch (error) {
      next(error)
    }
  }

  // 🔹 Shift sil
  async deleteShift(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      await service.deleteShift(id)
      res.status(200).json({ message: 'Çalışma saat aralığı silindi' })
    } catch (error) {
      next(error)
    }
  }
}
