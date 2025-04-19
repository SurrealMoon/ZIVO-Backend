import prisma from '../lib/prismaClient'

export class BusinessRatingService {
  // Yeni puan oluştur (her kullanıcı sadece bir kez puanlayabilir)
  async create(userId: string, businessId: string, rating: number) {
    // Eğer varsa hata ver
    const existing = await prisma.businessRating.findUnique({
      where: {
        userId_businessId: { userId, businessId },
      },
    })

    if (existing) {
      throw new Error('Bu kullanıcı bu mağazaya zaten puan vermiş.')
    }

    return await prisma.businessRating.create({
      data: {
        userId,
        businessId,
        rating,
      },
    })
  }

  // Kullanıcının puanını güncelle
  async update(userId: string, businessId: string, rating: number) {
    return await prisma.businessRating.update({
      where: {
        userId_businessId: { userId, businessId },
      },
      data: {
        rating,
      },
    })
  }

  // Kullanıcının puanını sil
  async delete(userId: string, businessId: string) {
    return await prisma.businessRating.delete({
      where: {
        userId_businessId: { userId, businessId },
      },
    })
  }

  // Belirli bir mağazaya ait tüm puanları getir
  async getRatingsByBusiness(businessId: string) {
    return await prisma.businessRating.findMany({
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
      orderBy: { createdAt: 'desc' },
    })
  }

  // Ortalama puan ve toplam değerlendirme sayısı
  async getRatingSummary(businessId: string) {
    const [avg, count] = await prisma.$transaction([
      prisma.businessRating.aggregate({
        where: { businessId },
        _avg: { rating: true },
      }),
      prisma.businessRating.count({
        where: { businessId },
      }),
    ])

    return {
      average: avg._avg.rating ?? 0,
      total: count,
    }
  }
}
