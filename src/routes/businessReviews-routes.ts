import { Router } from 'express'
import { BusinessReviewHandler } from '../controllers/businessReviews-handler'
import { authenticate } from '../middlewares/authenticateMiddleware'
import { authorizeRoles } from '../middlewares/authorizeRoles'

const router = Router()
const handler = new BusinessReviewHandler()

router.use(authenticate)

router.post('/', handler.create)

// Admin/superadmin herkesin yorumunu, kullanıcı sadece kendi yorumunu güncelleyebilir
router.put(
    '/:id',
    authorizeRoles('customer', 'admin', 'super_admin'),
    handler.update
  )

router.delete(
    '/:id',
    authorizeRoles('customer', 'admin', 'super_admin'), // yorum sahibi veya moderatör olabilir
    handler.delete
  )

router.get('/business/:businessId', handler.getByBusiness)

export default router
