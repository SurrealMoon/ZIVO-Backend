// src/services/businessReviews-service.ts
import prisma from '../lib/prismaClient'

export class BusinessReviewService {
  // Yeni yorum oluştur
  async create(userId: string, businessId: string, content: string, imageUrl?: string) {
    const existing = await prisma.businessReview.findUnique({
      where: {
        userId_businessId: { userId, businessId },
      },
    })

    if (existing) {
      throw new Error('Bu kullanıcı bu mağazaya zaten yorum yapmış.')
    }

    return await prisma.businessReview.create({
      data: {
        userId,
        businessId,
        content,
        imageUrl,
      },
    })
  }

  // Yorum güncelle
  async updateById(id: string, content: string, imageUrl?: string) {
    return await prisma.businessReview.update({
      where: { id },
      data: { content, imageUrl },
    })
  }

  // Yorum sil
  async deleteById(reviewId: string) {
    return await prisma.businessReview.delete({
      where: { id: reviewId },
    })
  }

  // Belirli mağazaya ait tüm yorumları getir
  async getReviewsByBusiness(businessId: string) {
    return await prisma.businessReview.findMany({
      where: { businessId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            photoKey: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getReview(userId: string, businessId: string) {
    return await prisma.businessReview.findFirst({
      where: {
        businessId,
        userId,
      },
    })
  }

  async getReviewById(reviewId: string) {
    return await prisma.businessReview.findUnique({
      where: { id: reviewId },
    })
  }
  
}
