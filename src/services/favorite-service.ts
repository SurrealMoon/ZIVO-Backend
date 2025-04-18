import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class FavoriteService {
  // Favori mağaza ekle
  async addFavorite(userId: string, businessId: string) {
    try {
      return await prisma.favorite.create({
        data: {
          userId,
          businessId
        }
      })
    } catch (error) {
      console.error('Favori eklenirken hata:', error)
      throw error
    }
  }

  // Kullanıcının favorilerini getir
  async getFavorites(userId: string) {
    try {
      return await prisma.favorite.findMany({
        where: { userId },
        include: {
          // İstersen business bilgisi de eklersin
          // business: true
        }
      })
    } catch (error) {
      console.error('Favoriler getirilirken hata:', error)
      throw error
    }
  }

  // Favoriyi ID ile kaldır (UUID)
  async removeFavoriteById(favoriteId: string) {
    try {
      return await prisma.favorite.delete({
        where: { id: favoriteId }
      })
    } catch (error) {
      console.error('Favori silinirken hata:', error)
      throw error
    }
  }

  // Opsiyonel: userId + businessId ile sil (daha spesifik kullanım)
  async removeFavoriteByBusiness(userId: string, businessId: string) {
    try {
      return await prisma.favorite.delete({
        where: {
          userId_businessId: {
            userId,
            businessId
          }
        }
      })
    } catch (error) {
      console.error('Favori (businessId ile) silinirken hata:', error)
      throw error
    }
  }
}
