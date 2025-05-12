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
router.post('/me/photo', authenticate, photoUpload.single('file'), profileHandler.uploadPhoto);
// fotoğraf silme
router.delete('/me/photo', authenticate, profileHandler.deletePhoto.bind(profileHandler));


export default router
