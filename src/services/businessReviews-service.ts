import prisma from '../lib/prismaClient'

export class BusinessReviewService {
  // Yeni yorum oluştur
  async create(userId: string, appointmentId: string, content: string, photoKey?: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { review: true, business: true },
    })
  
    if (!appointment) throw new Error('Randevu bulunamadı.')
    if (appointment.customerId !== userId) throw new Error('Bu randevu size ait değil.')
    if (appointment.status !== 'COMPLETED') throw new Error('Yalnızca tamamlanan randevular için yorum yapabilirsiniz.')
    if (appointment.review) throw new Error('Bu randevu için zaten bir yorum bırakılmış.')
  
    return await prisma.businessReview.create({
      data: {
        appointmentId,
        userId,
        businessId: appointment.businessId,
        content,
        photoKey,
      },
    })
  }
  

  // Yorum güncelle
  async updateById(id: string, content: string, photoKey?: string) {
    return await prisma.businessReview.update({
      where: { id },
      data: { content, photoKey },
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
        appointment: {
          select: {
            date: true,
            services: {
              include: {
                service: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  // Belirli appointment için yorum
  async getByAppointmentId(appointmentId: string) {
    return await prisma.businessReview.findUnique({
      where: { appointmentId },
    })
  }

  // ID ile getir
  async getReviewById(reviewId: string) {
    return await prisma.businessReview.findUnique({
      where: { id: reviewId },
    })
  }
}
