// src/controllers/workerTypes-handler.ts
import { Response, NextFunction } from 'express'
import { WorkerTypeService } from '../services/workerTypes-service'
import { AuthenticatedRequest } from '../middlewares/authenticateMiddleware'

export class WorkerTypeHandler {
  private service = new WorkerTypeService()

  getAll = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const types = await this.service.getAllWorkerTypes()
      res.status(200).json(types)
    } catch (error) {
      next(error)
    }
  }

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, description } = req.body
      if (!name) {
        res.status(400).json({ error: 'İsim zorunludur.' })
        return
      }

      const newType = await this.service.createWorkerType(name, description)
      res.status(201).json({
        message: 'Çalışan türü başarıyla oluşturuldu',
        workerType: newType
      })
    } catch (error) {
      next(error)
    }
  }

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const { name, description } = req.body

      const updated = await this.service.updateWorkerType(id, name, description)
      res.status(200).json({
        message: 'Çalışan türü başarıyla güncellendi',
        workerType: updated
      })
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      await this.service.deleteWorkerType(id)
      res.status(200).json({ message: 'Çalışan türü başarıyla silindi' })
    } catch (error) {
      next(error)
    }
  }
}
