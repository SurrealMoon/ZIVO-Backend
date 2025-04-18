import { PrismaClient, Prisma, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

// Genişletilmiş kullanıcı tipi
type UserWithRoles = Prisma.UserGetPayload<{
  include: { roles: true }
}>

const prisma = new PrismaClient()

export class UserService {
  // Salt oluşturma metodu
  private generateSalt(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  // Şifre hashleme metodu
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password + salt, 10)
  }

  // Şifre doğrulama metodu
  private async verifyPassword(
    inputPassword: string, 
    storedPassword: string, 
    salt: string
  ): Promise<boolean> {
    const hashedInputPassword = await bcrypt.hash(inputPassword + salt, 10)
    return hashedInputPassword === storedPassword
  }

  // Kullanıcı kayıt işlemi
  async register(data: Prisma.UserCreateInput & { 
    password: string 
    salt?: string 
  }) {
    try {
      // Salt oluşturma
      const salt = this.generateSalt();

      // Şifre hashleme
      const hashedPassword = await this.hashPassword(data.password, salt);

      // Email kontrolü
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new Error('Bu email zaten kullanımda');
      }

      const user = await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
          salt, // Salt'ı da kaydet
          roles: {
            create: [{ role: 'customer' }] // Varsayılan rol
          }
        },
        include: { roles: true }
      });

      return user;
    } catch (error) {
      console.error('Kayıt sırasında hata:', error);
      throw error;
    }
  }

  // Kullanıcı girişi
  async login(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({ 
        where: { email },
        include: { roles: true }
      }) as UserWithRoles;

      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }

      // Şifre doğrulama (salt ile)
      const isPasswordValid = await this.verifyPassword(
        password, 
        user.password, 
        user.salt ?? this.generateSalt() // Nullish coalescing operator
      );

      if (!isPasswordValid) {
        throw new Error('Geçersiz şifre');
      }

      // JWT Token oluşturma
      const token = jwt.sign(
        { 
          userId: user.id, 
          roles: user.roles.map(r => r.role as UserRole) 
        }, 
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      return { user, token };
    } catch (error) {
      console.error('Giriş sırasında hata:', error);
      throw error;
    }
  }

  // Kullanıcı profili güncelleme
  async updateProfile(userId: string, data: Prisma.UserUpdateInput) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          ...data
        }
      });
    } catch (error) {
      console.error('Profil güncelleme sırasında hata:', error);
      throw error;
    }
  }

  // Şifre değiştirme metodu
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    try {
      // Kullanıcıyı bul
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }

      // Eski şifreyi doğrula
      const isOldPasswordValid = await this.verifyPassword(
        oldPassword, 
        user.password, 
        user.salt ?? this.generateSalt()
      );

      if (!isOldPasswordValid) {
        throw new Error('Mevcut şifre yanlış');
      }

      // Yeni salt oluştur
      const newSalt = this.generateSalt();

      // Yeni şifreyi hashle
      const newHashedPassword = await this.hashPassword(newPassword, newSalt);

      // Şifreyi güncelle
      return await prisma.user.update({
        where: { id: userId },
        data: {
          password: newHashedPassword,
          salt: newSalt
        }
      });
    } catch (error) {
      console.error('Şifre değiştirme sırasında hata:', error);
      throw error;
    }
  }

  // Kullanıcı rolleri güncelleme
  async updateRoles(userId: string, roles: UserRole[]) {
    try {
      // Mevcut rolleri sil
      await prisma.role.deleteMany({ 
        where: { userId } 
      });

      // Yeni rolleri ekle
      return await prisma.role.createMany({
        data: roles.map(role => ({
          userId,
          role
        }))
      });
    } catch (error) {
      console.error('Rol güncelleme sırasında hata:', error);
      throw error;
    }
  }

  // Kullanıcı bilgilerini getirme
  async getUserProfile(userId: string) {
    try {
      return await prisma.user.findUnique({
        where: { id: userId },
        include: { 
          roles: true 
        }
      });
    } catch (error) {
      console.error('Kullanıcı profili getirme sırasında hata:', error);
      throw error;
    }
  }

  // Tüm kullanıcıları getirme (Super Admin için)
  async getAllUsers() {
    try {
      return await prisma.user.findMany({
        include: { roles: true }
      });
    } catch (error) {
      console.error('Kullanıcıları getirme sırasında hata:', error);
      throw error;
    }
  }

  // Kullanıcı silme (Super Admin için)
  async deleteUser(userId: string) {
    try {
      return await prisma.user.delete({
        where: { id: userId }
      });
    } catch (error) {
      console.error('Kullanıcı silme sırasında hata:', error);
      throw error;
    }
  }
}
