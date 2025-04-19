import { Router } from 'express'
import { authenticate } from '../middlewares/authenticateMiddleware'
import { BusinessHandler } from '../controllers/business-handler'
import { authorizeRoles } from '../middlewares/authorizeRoles'
import { isStoreOwner } from '../middlewares/isStoreOwner'



const router = Router()
const businessHandler = new BusinessHandler()

router.use(authenticate)

// 🔹 Yeni mağaza oluştur 12345678 / 123456
router.post('/', authorizeRoles('store_owner', 'super_admin'), businessHandler.createBusiness)

// 🔹 Tüm mağazaları getir
router.get('/', businessHandler.getAllBusinesses)

// 🔹 Belirli mağazayı getir
router.get('/:id', businessHandler.getBusinessById)

// 🔹 Mağaza güncelle
router.put('/:id', isStoreOwner, businessHandler.updateBusiness)

// 🔹 Mağaza sil (soft delete)
router.delete('/:id', authorizeRoles('admin', 'super_admin'), businessHandler.deleteBusiness)

export default router
