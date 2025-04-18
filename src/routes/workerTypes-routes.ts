// src/routes/workerTypes-routes.ts
import { Router } from 'express'
import { WorkerTypeHandler } from '../controllers/workerTypes-handler'
import { authenticate } from '../middlewares/authenticateMiddleware'
import { authorizeRoles } from '../middlewares/authorizeRoles'

const router = Router()
const handler = new WorkerTypeHandler()

router.use(authenticate)

// 🔹 Yeni worker türü oluştur (sadece admin/super admin)
router.post('/', authorizeRoles('admin', 'super_admin'), handler.create)

// 🔹 Tüm worker türlerini getir (herkes erişebilir)
router.get('/', handler.getAll)

// 🔹 Worker türü güncelle
router.put('/:id', authorizeRoles('admin', 'super_admin'), handler.update)

// 🔹 Worker türü sil
router.delete('/:id', authorizeRoles('admin', 'super_admin'), handler.delete)

export default router
