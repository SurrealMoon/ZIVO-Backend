import { PrismaClient, UserRole, Role, User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const prisma = new PrismaClient()
// Şifre için salt oluştur
const generateSalt = (): string => {
  return crypto.randomBytes(16).toString('hex')
}

// Salt ile şifreyi hashle
const hashPassword = async (password: string, salt: string): Promise<string> => {
  return bcrypt.hash(password + salt, 10)
}
export const createUser = async (
  data: {
    tag: string
    name: string
    surname: string
    email: string
    phone: string
    password: string
    role: UserRole
  }
): Promise<User> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    throw new Error('Bu email zaten kullanımda')
  }

  const salt = generateSalt()
  const hashedPassword = await hashPassword(data.password, salt)

  const user = await prisma.user.create({
    data: {
      tag: data.tag,
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      salt,
      roles: {
        create: [{ role: data.role }]
      }
    }
  })

  return user
}

// 🔹 Tüm kullanıcıları getir
export const getAllUsers = async (): Promise<(User & { roles: Role[] })[]> => {
  return await prisma.user.findMany({
    include: {
      roles: true,
    },
  })
}

// 🔹 Kullanıcıyı ID ile sil
export const deleteUserById = async (userId: string): Promise<User> => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!existingUser) {
    throw new Error('Kullanıcı bulunamadı')
  }

  return await prisma.user.delete({
    where: { id: userId },
  })
}

// 🔹 Kullanıcının rolünü güncelle
export const updateUserRole = async (
  userId: string,
  newRole: UserRole
): Promise<Role> => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('Kullanıcı bulunamadı')

  // Tüm mevcut rolleri sil
  await prisma.role.deleteMany({ where: { userId } })

  // Yeni rol ata
  return await prisma.role.create({
    data: {
      userId,
      role: newRole,
    },
  })
}
