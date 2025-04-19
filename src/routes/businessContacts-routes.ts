import { Router } from 'express'
import { BusinessContactHandler } from '../controllers/businessContacts-handler'
import { authenticate } from '../middlewares/authenticateMiddleware'
import { authorizeRoles } from '../middlewares/authorizeRoles'
import { isBusinessOwner } from '../middlewares/isBusinessOwner'

const router = Router()
const handler = new BusinessContactHandler()

router.use(authenticate)

// 🔹 Yeni iletişim bilgisi oluştur
router.post('/', authorizeRoles('store_owner', 'super_admin'), isBusinessOwner, handler.create)

// 🔹 Belirli mağazanın iletişim bilgilerini getir
router.get('/business/:businessId', handler.getByBusiness)

// 🔹 Güncelle
router.put('/:id', authorizeRoles('store_owner', 'super_admin'), handler.update)

// 🔹 Sil
router.delete('/:id', authorizeRoles('store_owner', 'super_admin'), handler.delete)

export default router
