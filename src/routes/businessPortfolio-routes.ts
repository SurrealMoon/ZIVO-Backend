// src/routes/businessPortfolio-routes.ts
import { Router } from 'express'
import { BusinessPortfolioHandler } from '../controllers/businessPortfolio-handler'
import { authenticate } from '../middlewares/authenticateMiddleware'
import { authorizeRoles } from '../middlewares/authorizeRoles'

const router = Router()
const handler = new BusinessPortfolioHandler()

router.use(authenticate)

// 🔹 Yeni medya ekle
router.post('/', authorizeRoles('store_owner', 'super_admin'), handler.create)

// 🔹 Güncelle
router.put('/:id', authorizeRoles('store_owner', 'super_admin'), handler.update)

// 🔹 Sil
router.delete('/:id', authorizeRoles('store_owner', 'super_admin'), handler.delete)

// 🔹 Listeleme
router.get('/business/:businessId', handler.getByBusiness)
router.get('/:id', handler.getById)

export default router
