// src/services/businessPortfolio-service.ts
import prisma from '../lib/prismaClient'

export class BusinessPortfolioService {
  // Yeni medya ekle
  async create(businessId: string, mediaUrl: string, mediaType: "image" | "video") {
    return await prisma.businessPortfolio.create({
      data: {
        businessId,
        mediaUrl,
        mediaType,
      },
    })
  }

  // Mağazanın tüm portfolyo medyalarını getir
  async getByBusiness(businessId: string) {
    return await prisma.businessPortfolio.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    })
  }

  // Tekil medya kaydı getir
  async getById(id: string) {
    return await prisma.businessPortfolio.findUnique({
      where: { id },
    })
  }

  // Medya güncelle
  async update(id: string, mediaUrl: string, mediaType: "image" | "video") {
    return await prisma.businessPortfolio.update({
      where: { id },
      data: { mediaUrl, mediaType },
    })
  }

  // Medya sil
  async delete(id: string) {
    return await prisma.businessPortfolio.delete({
      where: { id },
    })
  }
}
