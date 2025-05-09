import express from 'express'
import { UserHandler } from '../controllers/user-handler'

const router = express.Router()
const userHandler = new UserHandler()

router.post('/register', userHandler.register.bind(userHandler))

export default router
