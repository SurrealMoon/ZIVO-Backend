import { Response, NextFunction } from 'express'
import { UserService } from '../services/user-service'
import { UserRole } from '@prisma/client'
import { AuthenticatedRequest } from '../middlewares/authenticateMiddleware'

const userService = new UserService()

export class UserHandler {
  async register(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

  async login(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.authUser?.id
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

  async updateUserRoles(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

  async getUserProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.authUser?.id
      if (!userId) {
        return res.status(401).json({ message: 'Yetkisiz erişim' })
      }

      const userProfile = await userService.getUserProfile(userId)

      res.status(200).json(userProfile)
    } catch (error) {
      next(error)
    }
  }

  async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers()

      res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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
