import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixMissingProfiles() {
  try {
    console.log('🔎 Eksik profil kayıtları taranıyor...');

    // Profile kaydı olmayan kullanıcıları bul
    const usersWithoutProfile = await prisma.user.findMany({
      where: {
        profile: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
      },
    });

    if (usersWithoutProfile.length === 0) {
      console.log('✅ Tüm kullanıcıların profili mevcut. İşlem yapılmadı.');
      return;
    }

    console.log(`📝 Eksik profile sahip ${usersWithoutProfile.length} kullanıcı bulundu.`);

    // Profile kayıtlarını oluştur
    for (const user of usersWithoutProfile) {
      await prisma.profile.create({
        data: {
          userId: user.id,
          bio: '',
          birthDate: undefined,
          avatarUrl: undefined,
        },
      });

      console.log(`✅ Profile oluşturuldu: ${user.name} ${user.surname} (${user.email})`);
    }

    console.log('🎉 Tüm eksik profiller başarıyla tamamlandı.');
  } catch (error) {
    console.error('❌ Hata oluştu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixMissingProfiles();
