import { Router } from 'express'
import { login, logout, refreshToken } from '../controllers/auth-handler'
import { getMe } from '../controllers/auth-handler';
import { authenticate } from '../middlewares/authenticateMiddleware';

const router = Router()

router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh-token', refreshToken)
router.get('/me', authenticate, getMe);




export default router
