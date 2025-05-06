import { Router } from 'express'
import { BusinessReviewHandler } from '../controllers/businessReviews-handler'
import { authenticate } from '../middlewares/authenticateMiddleware'
import { authorizeRoles } from '../middlewares/authorizeRoles'

const router = Router()
const handler = new BusinessReviewHandler()

router.use(authenticate)

// Yorum oluşturma (appointmentId üzerinden)
router.post('/appointment', authorizeRoles('customer'), handler.create)

// Yorum güncelleme
router.put(
  '/:id',
  authorizeRoles('customer', 'admin', 'super_admin'),
  handler.update
)

// Yorum silme
router.delete(
  '/:id',
  authorizeRoles('customer', 'admin', 'super_admin'),
  handler.delete
)

// Mağaza bazlı tüm yorumlar
router.get('/business/:businessId', handler.getByBusiness)

export default router

