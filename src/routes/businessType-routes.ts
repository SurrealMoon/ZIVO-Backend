import { Router } from 'express'
import { BusinessTypeHandler } from '../controllers/businessType-handler'

const router = Router()
const handler = new BusinessTypeHandler()

// 🔹 Tüm mağaza türlerini getir
router.get('/', handler.getAll)

export default router
