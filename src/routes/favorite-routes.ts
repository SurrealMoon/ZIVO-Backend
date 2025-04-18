import { Router } from 'express'
import { authenticate } from '../middlewares/authenticateMiddleware'
import { FavoriteHandler } from '../controllers/favorite-handler'

const router = Router()
const favoriteHandler = new FavoriteHandler()

router.use(authenticate)

// Favori ekle
router.post('/', favoriteHandler.addFavorite)

// Favorileri getir
router.get('/', favoriteHandler.getFavorites)

// Favori sil (tekil ID ile)
router.delete('/:id', favoriteHandler.removeFavoriteById)

// Favori sil (userId + businessId ile)
router.delete('/by-business/:businessId', favoriteHandler.removeFavoriteByBusiness)

export default router
