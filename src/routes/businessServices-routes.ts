import { Router } from 'express'
import { BusinessServiceHandler } from '../controllers/businessServices-handler'
import { authenticate } from '../middlewares/authenticateMiddleware'
import { authorizeRoles } from '../middlewares/authorizeRoles'
import { isServiceOwner } from '../middlewares/isServiceOwner'


const router = Router()
const handler = new BusinessServiceHandler()

router.use(authenticate)

// 🔹 Yeni hizmet oluştur (store_owner & super_admin)
router.post(
    '/create',
    authorizeRoles('store_owner', 'super_admin'),
    isServiceOwner,
    handler.createService
  )
// 🔹 Belirli mağazanın tüm hizmetlerini getir
router.get('/business/:businessId', handler.getServicesByBusiness)

// 🔹 Belirli hizmeti getir
router.get('/detail/:id', handler.getServiceById)

// 🔹 Hizmeti güncelle (sadece yetkili rol)
router.put('/:id',
    authorizeRoles('store_owner', 'super_admin'),
    isServiceOwner, 
    handler.updateService
  )
// 🔹 Hizmeti sil (store_owner & super_admin)
router.delete('/:id',
    authorizeRoles('store_owner', 'super_admin'),
    isServiceOwner,
    handler.deleteService
  )
export default router
