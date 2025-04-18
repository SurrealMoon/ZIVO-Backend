import { Request, Response } from 'express'
import * as superAdminService from '../services/superAdmin-service'
import { UserRole } from '@prisma/client'

// 🔹 Yeni kullanıcı oluştur
export const createNewUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tag, name, surname, email, phone, password, role } = req.body

    if (!Object.values(UserRole).includes(role)) {
      res.status(400).json({ error: 'Geçersiz rol' })
      return
    }

    const newUser = await superAdminService.createUser({
      tag,
      name,
      surname,
      email,
      phone,
      password,
      role
    })

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      userId: newUser.id
    })
  } catch (err) {
    console.error('Kullanıcı oluşturma hatası:', err)
    res.status(500).json({ error: 'Kullanıcı oluşturulamadı' })
  }
}

// 🔹 Tüm kullanıcıları getir
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await superAdminService.getAllUsers()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Kullanıcılar listelenemedi' })
  }
}

// 🔹 Kullanıcı sil
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    await superAdminService.deleteUserById(id)
    res.json({ message: 'Kullanıcı başarıyla silindi' })
  } catch (err) {
    res.status(500).json({ error: 'Kullanıcı silinemedi' })
  }
}

// 🔹 Kullanıcının rolünü güncelle
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { role } = req.body

    if (!Object.values(UserRole).includes(role)) {
      res.status(400).json({ error: 'Geçersiz rol' })
      return
    }

    const updatedRole = await superAdminService.updateUserRole(id, role)
    res.json({ message: 'Rol güncellendi', role: updatedRole })
  } catch (err) {
    res.status(500).json({ error: 'Kullanıcı rolü güncellenemedi' })
  }
}
