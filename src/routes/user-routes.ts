import { Router } from 'express'

const router = Router()

// örnek endpoint
router.get('/', (req, res) => {
  res.json({ message: 'User route aktif!' })
})

export default router
