import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { addDays } from 'date-fns'

const prisma = new PrismaClient()

export class AuthService {
  // 🔄 Refresh Token oluşturma
  async generateRefreshToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(40).toString('hex')
    const expiresAt = addDays(new Date(), 7) // 7 gün geçerli

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      }
    })

    return token
  }

  // ♻️ Refresh Token doğrulama ve yenileme
  async rotateRefreshToken(oldToken: string) {
    const existing = await prisma.refreshToken.findUnique({
      where: { token: oldToken },
      include: { user: { include: { roles: true } } }
    })

    if (!existing || existing.expiresAt < new Date()) {
      throw new Error('Refresh token geçersiz veya süresi dolmuş')
    }

    // Eski token'ı sil
    await prisma.refreshToken.delete({ where: { token: oldToken } })

    // Yeni access token oluştur
    const newAccessToken = jwt.sign(
      {
        userId: existing.user.id,
        roles: existing.user.roles.map(r => r.role)
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    )

    // Yeni refresh token oluştur
    const newRefreshToken = await this.generateRefreshToken(existing.user.id)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  }
}
