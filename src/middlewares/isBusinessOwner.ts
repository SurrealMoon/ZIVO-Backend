import { AuthenticatedRequest } from './authenticateMiddleware'
import { Response, NextFunction } from 'express'
import prisma from '../lib/prismaClient'

export const isBusinessOwner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId, roles } = req

  if (!userId) {
    res.status(401).json({ error: 'Kimlik doğrulaması gerekiyor.' })
    return
  }

  // admin/super_admin → geçiş
  if (roles?.includes('admin') || roles?.includes('super_admin')) {
    return next()
  }

  // store_owner değilse → erişim reddedilir
  if (!roles?.includes('store_owner')) {
    res.status(403).json({ error: 'Bu işlem yalnızca mağaza sahiplerine veya adminlere özeldir.' })
    return
  }

  // Hedef ID → body'den ya da params'tan gelsin
  const businessId = req.body.businessId || req.params.businessId

  if (!businessId) {
    res.status(400).json({ error: 'businessId eksik' })
    return
  }

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

  next()
}
