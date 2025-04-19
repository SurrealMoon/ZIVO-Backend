import prisma from '../lib/prismaClient'

export class BusinessContactService {
  // Yeni iletişim bilgisi oluştur
  async create(businessId: string, contactType: string, contactValue: string) {
    return await prisma.businessContact.create({
      data: {
        businessId,
        contactType,
        contactValue,
      },
    })
  }

  // Belirli mağazanın tüm iletişim bilgilerini getir
  async getByBusiness(businessId: string) {
    return await prisma.businessContact.findMany({
      where: { businessId },
      orderBy: { createdAt: 'asc' },
    })
  }

  // Tekil iletişim bilgisini getir
  async getById(id: string) {
    return await prisma.businessContact.findUnique({
      where: { id },
    })
  }

  // Güncelle
  async update(id: string, contactType: string, contactValue: string) {
    return await prisma.businessContact.update({
      where: { id },
      data: { contactType, contactValue },
    })
  }

  // Sil
  async delete(id: string) {
    return await prisma.businessContact.delete({
      where: { id },
    })
  }
}
