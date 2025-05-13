import { PrismaClient } from '@prisma/client'
import { S3Service } from './s3-service'; 


const prisma = new PrismaClient()
const s3Service = new S3Service();


export class ProfileService {
  async createProfile(userId: string, data: { bio?: string; birthDate?: Date; photoKey?: string }) {
  try {
    const createdProfile = await prisma.profile.create({
      data: {
        userId,
        bio: data.bio,
        birthDate: data.birthDate,
        
      },
    });

    if (data.photoKey) {
      await prisma.user.update({
        where: { id: userId },
        data: { photoKey: data.photoKey },
      });
    }

    return createdProfile;
  } catch (error) {
    console.error('Profil oluşturulurken hata:', error);
    throw error;
  }
}


  async getMyProfile(userId: string) {
  try {
    return await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            phone: true,
            gender: true,
            photoKey: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Profil getirme sırasında hata:', error);
    throw error;
  }
}


async updateMyProfile(userId: string, data: {
  name?: string;
  surname?: string;
  phone?: string;
  bio?: string;
  birthDate?: Date;
  photoKey?: string; 
  gender?: 'men' | 'women' | 'everyone';
}) {
  try {
    const {
      name,
      surname,
      phone,
      gender,
      bio,
      birthDate,
      photoKey,
    } = data;

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        bio,
        birthDate,
      },
      include: {
        user: true, 
      },
    });

  
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        surname,
        phone,
        gender,
        photoKey, 
      },
    });

    return updatedProfile;
  } catch (error) {
    console.error('Profil güncelleme sırasında hata:', error);
    throw error;
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

  if (!user?.photoKey) {
    // Fotoğraf zaten yoksa hata yerine sessizce başarılı dönebiliriz (idempotent mantık)
    console.warn(`deletePhoto: Kullanıcı ${userId} için photoKey bulunamadı.`);
    return;
  }

  try {
    // ✅ S3'ten sil
    await s3Service.deleteFile(user.photoKey);

    // ✅ DB'den temizle
    await prisma.user.update({
      where: { id: userId },
      data: { photoKey: null },
    });

    console.log(`deletePhoto: Kullanıcı ${userId} için photo silindi → ${user.photoKey}`);
  } catch (error) {
    console.error('deletePhoto hatası:', error);
    throw new Error('Profil fotoğrafı silinirken hata oluştu.');
  }
}

}

