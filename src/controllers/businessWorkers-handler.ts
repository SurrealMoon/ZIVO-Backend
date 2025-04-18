import { Response, NextFunction } from 'express'
import { BusinessWorkerService } from '../services/businessWorkers-service'
import { AuthenticatedRequest } from '../middlewares/authenticateMiddleware'

export class BusinessWorkerHandler {
  private service = new BusinessWorkerService()

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { businessId, workerTypeId, userId, name, photoUrl, bio } = req.body

      if (!businessId || !workerTypeId || !name) {
        res.status(400).json({ message: 'businessId, workerTypeId ve name zorunludur.' })
        return
      }

      const created = await this.service.create({ businessId, workerTypeId, userId, name, photoUrl, bio })

      res.status(201).json({
        message: 'Çalışan başarıyla oluşturuldu',
        worker: created,
      })
    } catch (error) {
      next(error)
    }
  }

  getByBusiness = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { businessId } = req.params

      const workers = await this.service.getByBusinessId(businessId)

      res.status(200).json(workers)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const worker = await this.service.getById(id)

      if (!worker) {
        res.status(404).json({ message: 'Çalışan bulunamadı' })
        return
      }

      res.status(200).json(worker)
    } catch (error) {
      next(error)
    }
  }

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const updateData = req.body

      const updated = await this.service.update(id, updateData)

      res.status(200).json({
        message: 'Çalışan bilgisi güncellendi',
        worker: updated,
      })
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      await this.service.delete(id)

      res.status(200).json({ message: 'Çalışan başarıyla silindi' })
    } catch (error) {
      next(error)
    }
  }
}
