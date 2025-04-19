// src/routes/businessCalendar-routes.ts
import { Router } from 'express'
import { BusinessCalendarHandler } from '../controllers/businessCalendar-handler'
import { authenticate } from '../middlewares/authenticateMiddleware'
import { authorizeRoles } from '../middlewares/authorizeRoles'

const router = Router()
const handler = new BusinessCalendarHandler()

router.use(authenticate)

// 🔹 Gün oluştur (veya gün + shift)
router.post('/', authorizeRoles('store_owner', 'super_admin'), handler.create)

// 🔹 Güncelle
router.put('/:id', authorizeRoles('store_owner', 'super_admin'), handler.update)

// 🔹 Gün sil
router.delete('/:id', authorizeRoles('store_owner', 'super_admin'), handler.delete)

// 🔹 Shift ekle
router.post('/shift', authorizeRoles('store_owner', 'super_admin'), handler.createShift)

// 🔹 Shift sil
router.delete('/shift/:id', authorizeRoles('store_owner', 'super_admin'), handler.deleteShift)

// 🔹 Takvim günleri
router.get('/business/:businessId', handler.getByBusiness)
router.get('/:id', handler.getById)

export default router
