import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class BusinessServiceService {
  // 🔹 Yeni hizmet oluştur
  async createService(data: {
    businessId: string
    name: string
    price: number
    duration: number
    description?: string
  }) {
    return await prisma.businessService.create({
      data,
    })
  }

  // 🔹 Belirli bir mağazaya ait tüm hizmetleri getir
  async getServicesByBusiness(businessId: string) {
    return await prisma.businessService.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' }
    })
  }

  // 🔹 Belirli bir hizmeti ID ile getir
  async getServiceById(id: string) {
    return await prisma.businessService.findUnique({
      where: { id },
    })
  }

  // 🔹 Hizmeti güncelle
  async updateService(id: string, data: Partial<{
    name: string
    price: number
    duration: number
    description?: string
  }>) {
    return await prisma.businessService.update({
      where: { id },
      data,
    })
  }

  // 🔹 Hizmeti sil (hard delete)
  async deleteService(id: string) {
    return await prisma.businessService.delete({
      where: { id },
    })
  }
}
