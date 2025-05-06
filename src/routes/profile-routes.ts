import express from 'express'
import { authenticate } from '../middlewares/authenticateMiddleware'
import { ProfileHandler } from '../controllers/profile-handler'
import { photoUpload } from '../middlewares/uploadMiddleware'

const router = express.Router()
const profileHandler = new ProfileHandler()

router.post('/create', authenticate, profileHandler.createProfile)
router.get('/me', authenticate, profileHandler.getMyProfile)
router.put('/me', authenticate, profileHandler.updateMyProfile)


// fotoğraf yükleme işlemi
router.get('/photo-url', authenticate, profileHandler.getPhotoUrl.bind(profileHandler));
// fotoğraf silme
router.delete('/me/photo', authenticate, profileHandler.deletePhoto.bind(profileHandler));


export default router
