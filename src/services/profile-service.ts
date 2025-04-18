import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class ProfileService {
  async createProfile(userId: string, data: { bio?: string; birthDate?: Date; avatarUrl?: string }) {
    try {
      return await prisma.profile.create({
        data: {
          userId,
          bio: data.bio,
          birthDate: data.birthDate,
          avatarUrl: data.avatarUrl
        }
      })
    } catch (error) {
      console.error('Profil oluşturulurken hata:', error)
      throw error
    }
  }

  async getMyProfile(userId: string) {
    try {
      return await prisma.profile.findUnique({
        where: { userId }
      })
    } catch (error) {
      console.error('Profil getirme sırasında hata:', error)
      throw error
    }
  }

  async updateMyProfile(userId: string, data: { bio?: string; birthDate?: Date; avatarUrl?: string }) {
    try {
      return await prisma.profile.update({
        where: { userId },
        data
      })
    } catch (error) {
      console.error('Profil güncelleme sırasında hata:', error)
      throw error
    }
  }
}
