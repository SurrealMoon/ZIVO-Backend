import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthenticatedRequest extends Request {
  userId?: string
  roles?: string[]
  authUser?: {
    id: string
    email?: string
    roles?: string[]
    profileId?: string
  }
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token =
    req.cookies?.access_token || req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Token eksik' })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    req.userId = decoded.userId
    req.roles = decoded.roles

    // ✅ Artık 'authUser' alanına yazıyoruz, 'user' ile çakışma yok
    req.authUser = {
      id: decoded.userId,
      email: decoded.email,
      roles: decoded.roles,
      profileId: decoded.profileId,
    }

    next()
  } catch (err) {
    res.status(401).json({ error: 'Geçersiz token' })
  }
}
