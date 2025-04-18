import { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/user-service'
import { UserRole } from '@prisma/client'

const userService = new UserService()

export class UserHandler {
  // Kullanıcı Kayıt
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { 
        tag, name, surname, email, 
        password, phone, 
        location, gender, biography 
      } = req.body

      const user = await userService.register({
        tag, name, surname, email, 
        password, phone,
        location, gender, biography
      })

      res.status(201).json({
        message: 'Kullanıcı başarıyla oluşturuldu',
        userId: user.id
      })
    } catch (error) {
      next(error)
    }
  }

  // Kullanıcı Girişi
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body

      const { user, token } = await userService.login(email, password)

      res.status(200).json({
        message: 'Giriş başarılı',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles.map(r => r.role)
        }
      })
    } catch (error) {
      next(error)
    }
  }

  // Kullanıcı Profili Güncelleme
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // user özelliği artık tanımlı
      const userId = req.user?.id // Optional chaining kullanarak
      if (!userId) {
        return res.status(401).json({ message: 'Yetkisiz erişim' })
      }

      const updateData = req.body

      const updatedUser = await userService.updateProfile(userId, updateData)

      res.status(200).json({
        message: 'Profil başarıyla güncellendi',
        user: updatedUser
      })
    } catch (error) {
      next(error)
    }
  }

  // Kullanıcı Rolleri Güncelleme (Super Admin için)
  async updateUserRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params
      const { roles } = req.body

      await userService.updateRoles(userId, roles as UserRole[])

      res.status(200).json({
        message: 'Kullanıcı rolleri başarıyla güncellendi'
      })
    } catch (error) {
      next(error)
    }
  }

  // Kullanıcı Profili Getirme
  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ message: 'Yetkisiz erişim' })
      }

      const userProfile = await userService.getUserProfile(userId)

      res.status(200).json(userProfile)
    } catch (error) {
      next(error)
    }
  }

  // Tüm Kullanıcıları Getirme (Super Admin için)
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers()

      res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  // Kullanıcı Silme (Super Admin için)
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params

      await userService.deleteUser(userId)

      res.status(200).json({
        message: 'Kullanıcı başarıyla silindi'
      })
    } catch (error) {
      next(error)
    }
  }
}