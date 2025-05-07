import { PrismaClient, Prisma } from '@prisma/client'
import { S3Service } from './s3-service'


const prisma = new PrismaClient()
const s3Service = new S3Service()


export class BusinessService {
  // Mağaza oluştur (sadece store_owner yetkisiyle)
  async createBusiness(userId: string, data: Prisma.BusinessCreateInput) {
    try {
      return await prisma.business.create({
        data: {
          ...data,
          owner: { connect: { id: userId } }
        }
      })
    } catch (error) {
      console.error('Business oluşturulurken hata:', error)
      throw error
    }
  }

  // Belirli bir mağazayı getir
  async getBusinessById(id: string) {
    try {
      return await prisma.business.findUnique({
        where: { id },
        include: {
          owner: true,
        }
      })
    } catch (error) {
      console.error('Business getirme hatası:', error)
      throw error
    }
  }

  // Tüm mağazaları getir (opsiyonel filtreler eklenebilir)
  async getAllBusinesses() {
    try {
      return await prisma.business.findMany({
        where: { isDeleted: false, isApproved: true },
        include: {
          owner: true,        }
      })
    } catch (error) {
      console.error('Business listesi alınamadı:', error)
      throw error
    }
  }

  // Mağaza güncelle (sadece sahibi ya da admin yapabilir)
  async updateBusiness(id: string, data: Prisma.BusinessUpdateInput) {
    try {
      return await prisma.business.update({
        where: { id },
        data
      })
    } catch (error) {
      console.error('Business güncelleme hatası:', error)
      throw error
    }
  }

  // Mağaza sil (soft delete)
  async deleteBusiness(id: string, deletedBy: string) {
    try {
      return await prisma.business.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy
        }
      })
    } catch (error) {
      console.error('Business silme hatası:', error)
      throw error
    }
  }

    
// Business kapak görselini yükle
async uploadCoverImage(businessId: string, file: Express.Multer.File): Promise<string> {
  const photoKey = await s3Service.uploadFile(file.buffer, file.originalname, 'business-covers')

  await prisma.business.update({
    where: { id: businessId },
    data: { photoKey },
  })

  return photoKey
}

// Business görselini sil
async deleteCoverImage(businessId: string): Promise<void> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { photoKey: true },
  })

  if (!business || !business.photoKey) {
    throw new Error('Kapak fotoğrafı bulunamadı veya zaten silinmiş.')
  }

  await s3Service.deleteFile(business.photoKey)

  await prisma.business.update({
    where: { id: businessId },
    data: { photoKey: null },
  })
}
}
