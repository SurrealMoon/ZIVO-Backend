import express from 'express'
import { authenticate } from '../middlewares/authenticateMiddleware'
import { ProfileHandler } from '../controllers/profile-handler'

const router = express.Router()
const profileHandler = new ProfileHandler()

router.post('/create', authenticate, profileHandler.createProfile)
router.get('/me', authenticate, profileHandler.getMyProfile)
router.put('/me', authenticate, profileHandler.updateMyProfile)

export default router
