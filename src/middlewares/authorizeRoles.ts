import { RequestHandler, Response, NextFunction } from 'express'
import { AuthenticatedRequest } from './authenticateMiddleware'

export const authorizeRoles = (...allowedRoles: string[]): RequestHandler => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const userRoles = req.roles || []

    const hasRole = userRoles.some(role => allowedRoles.includes(role))
    if (!hasRole) {
      res.status(403).json({ message: 'Bu işlem için yetkiniz yok' })
      return
    }

    next()
  }
}
