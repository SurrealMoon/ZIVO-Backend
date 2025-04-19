// src/routes/businessRatings-routes.ts
import { Router } from 'express'
import { BusinessRatingHandler } from '../controllers/businessRatings-handler'
import { authenticate } from '../middlewares/authenticateMiddleware'

const router = Router()
const handler = new BusinessRatingHandler()

router.use(authenticate)

// 🔹 Puan oluştur (1 kez)
router.post('/', handler.create)

// 🔹 Puan güncelle
router.put('/', handler.update)

// 🔹 Puan sil (kullanıcıya ait olanı)
router.delete('/:businessId', handler.delete)

// 🔹 Belirli mağazanın tüm puanlarını getir
router.get('/business/:businessId', handler.getByBusiness)

// 🔹 Belirli mağazanın özet bilgisini getir (ortalama + toplam)
router.get('/summary/:businessId', handler.getSummary)

export default router
