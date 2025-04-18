import { Request, Response, NextFunction } from 'express'
import { BusinessTypeService } from '../services/businessType-service'

const service = new BusinessTypeService()

export class BusinessTypeHandler {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const types = await service.getAllTypes()
      res.status(200).json(types)
    } catch (error) {
      next(error)
    }
  }
}
