import { Router } from 'express'
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  createNewUser,
} from '../controllers/superAdmin-handler'
import { authenticate } from '../middlewares/authenticateMiddleware'
import { authorizeRoles } from '../middlewares/authorizeRoles'

const router = Router()

// 🔐 Tüm route'lar için önce kimlik doğrulama, sonra sadece super_admin yetkisi kontrolü
router.use(authenticate, authorizeRoles('super_admin'))

// 🔹 Tüm kullanıcıları getir
router.get('/users', getAllUsers)

// 🔹 Kullanıcı sil
router.delete('/users/:id', deleteUser)

// 🔹 Kullanıcı rolü güncelle
router.patch('/users/:id/role', updateUserRole)

// 🔹 Yeni kullanıcı oluştur
router.post('/users/create', createNewUser)

export default router
