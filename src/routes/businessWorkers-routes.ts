// src/routes/businessWorkers-routes.ts
import { Router } from 'express'
import { BusinessWorkerHandler } from '../controllers/businessWorkers-handler'
import { authenticate } from '../middlewares/authenticateMiddleware'
import { authorizeRoles } from '../middlewares/authorizeRoles'

const router = Router()
const handler = new BusinessWorkerHandler()

router.use(authenticate)

// 🔹 Yeni çalışan oluştur (store_owner & super_admin)
router.post(
  '/',
  authorizeRoles('store_owner', 'super_admin'),
  handler.create
)

// 🔹 Belirli mağazanın çalışanlarını getir
router.get('/business/:businessId', handler.getByBusiness)

// 🔹 Belirli çalışanı getir
router.get('/:id', handler.getById)

// 🔹 Çalışan güncelle
router.put(
  '/:id',
  authorizeRoles('store_owner', 'super_admin'),
  handler.update
)

// 🔹 Çalışanı sil
router.delete(
  '/:id',
  authorizeRoles('store_owner', 'super_admin'),
  handler.delete
)

export default router
