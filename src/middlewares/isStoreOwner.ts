import { AuthenticatedRequest } from './authenticateMiddleware'
import { Response, NextFunction } from 'express'
import prisma from '../lib/prismaClient'

export const isStoreOwner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId, roles } = req
  const businessId = req.params.id

  if (!userId) {
    res.status(401).json({ error: 'Kimlik doğrulaması gerekiyor.' })
    return
  }

  // admin ve super_admin → doğrudan geçebilir
  if (roles?.includes('admin') || roles?.includes('super_admin')) {
    next()
    return
  }

  // store_owner değilse → erişim reddedilir
  if (!roles?.includes('store_owner')) {
    res.status(403).json({ error: 'Bu işlem sadece mağaza sahiplerine veya adminlere özeldir.' })
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
    res.status(403).json({ error: 'Bu mağaza size ait değil.' })
    return
  }

  next()
}
