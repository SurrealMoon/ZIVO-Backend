import { AuthenticatedRequest } from './authenticateMiddleware'
import { Response, NextFunction } from 'express'
import prisma from '../lib/prismaClient'

export const isServiceOwner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId, roles } = req

  if (!userId || !roles?.includes('store_owner')) {
    res.status(403).json({ error: 'Bu işlem sadece mağaza sahiplerine özeldir.' })
    return
  }

  const serviceId = req.params.id
  const businessId = req.body.businessId

  // Eğer update/delete işlemi yapılıyorsa
  if (serviceId) {
    const service = await prisma.businessService.findUnique({
      where: { id: serviceId },
      include: { business: { select: { ownerId: true } } }
    })

    if (!service) {
      res.status(404).json({ error: 'Hizmet bulunamadı' })
      return
    }

    if (service.business.ownerId !== userId) {
      res.status(403).json({ error: 'Bu hizmet size ait bir mağazaya bağlı değil.' })
      return
    }

    return next()
  }

  // Eğer create işlemi yapılıyorsa
  if (businessId) {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true }
    })

    if (!business) {
      res.status(404).json({ error: 'Mağaza bulunamadı' })
      return
    }

    if (business.ownerId !== userId) {
      res.status(403).json({ error: 'Bu mağaza size ait değil, işlem yapılamaz.' })
      return
    }

    return next()
  }

  // Hiçbiri yoksa: yetersiz veri
  res.status(400).json({ error: 'serviceId veya businessId eksik' })
}
