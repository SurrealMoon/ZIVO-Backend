import { PrismaClient } from '@prisma/client'
import { S3Service } from './s3-service'; 


const prisma = new PrismaClient()
const s3Service = new S3Service();


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
  async uploadPhoto(userId: string, file: Express.Multer.File): Promise<string> {
    const photoKey = await s3Service.uploadFile(file.buffer, file.originalname, 'user-photos');

    await prisma.user.update({
      where: { id: userId },
      data: { photoKey },
    });

    return photoKey;
}
async deletePhoto(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { photoKey: true },
  });

  if (!user || !user.photoKey) {
    throw new Error('Fotoğraf bulunamadı veya zaten silinmiş.');
  }

  // S3'ten sil
  await s3Service.deleteFile(user.photoKey);

  // DB'den sil (null yap)
  await prisma.user.update({
    where: { id: userId },
    data: { photoKey: null },
  });
}


}

