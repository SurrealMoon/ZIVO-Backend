import { Request, Response, NextFunction, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { AuthService } from '../services/auth-service'

const prisma = new PrismaClient()
const authService = new AuthService()

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email ve şifre gereklidir' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    })

    if (!user || !user.password || !user.salt) {
      res.status(401).json({ error: 'Geçersiz kimlik bilgileri' })
      return
    }

    const isValid = await bcrypt.compare(password + user.salt, user.password)
    if (!isValid) {
      res.status(401).json({ error: 'Geçersiz şifre' })
      return
    }

    const payload = {
      userId: user.id,
      roles: user.roles.map((r) => r.role),
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    })

    const refreshToken = await authService.generateRefreshToken(user.id)

    res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 * 1000,
      })
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
      })
      .status(200)
      .json({
        message: 'Giriş başarılı',
        userId: user.id,
        accessToken,
        refreshToken,
      })
  } catch (err) {
    next(err)
  }
}

export const logout = (req: Request, res: Response) => {
  res
    .clearCookie('access_token')
    .clearCookie('refresh_token')
    .status(200)
    .json({ message: 'Başarıyla çıkış yapıldı' })
}

// 🔄 Refresh token endpoint
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.refresh_token || req.body.refresh_token

    if (!token) {
      res.status(401).json({ error: 'Refresh token bulunamadı' })
      return
    }

    const tokens = await authService.rotateRefreshToken(token)

    res
      .cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 * 1000,
      })
      .cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: 'Token yenilendi',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })
  } catch (err) {
    next(err)
  }
}
