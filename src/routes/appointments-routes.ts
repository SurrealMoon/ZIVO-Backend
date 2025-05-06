import { Router } from 'express'
import { AppointmentHandler } from '../controllers/appointments-handler'
import { authenticate } from '../middlewares/authenticateMiddleware'
import { authorizeRoles } from '../middlewares/authorizeRoles'

const router = Router()
const handler = new AppointmentHandler()

router.use(authenticate)

router.post('/', authorizeRoles('customer'), handler.create)
router.get('/me', authorizeRoles('customer'), handler.getMine)
router.get('/:id', handler.getById)
router.delete('/:id', authorizeRoles('customer', 'admin', 'super_admin'), handler.cancel)
router.patch(
    '/:id/status',
    authorizeRoles('admin', 'super_admin', 'store_owner'),
    handler.updateStatus
  )
  

export default router
