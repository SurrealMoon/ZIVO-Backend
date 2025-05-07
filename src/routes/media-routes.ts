import { Router } from 'express'
import { authenticate } from '../middlewares/authenticateMiddleware'
import { MediaHandler } from '../controllers/media-handler'

const router = Router()
const handler = new MediaHandler()

// Fotoğraf için geçici erişim URL'si al
router.get('/photo-url', authenticate, handler.getPhotoUrl.bind(handler))

export default router
