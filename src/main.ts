import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import userRoutes from './routes/user-routes'
import superAdminRoutes from './routes/superAdmin-routes'
import authRoutes from './routes/auth-routes'
import profileRoutes from './routes/profile-routes'
import favoriteRoutes from './routes/favorite-routes'
import businessRoutes from './routes/business-routes'
import businessTypeRoutes from './routes/businessType-routes'
import businessServiceRoutes from './routes/businessServices-routes'
import workerTypeRoutes from './routes/workerTypes-routes'
import businessWorkerRoutes from './routes/businessWorkers-routes'
import businessRatingRoutes from './routes/businessRatings-routes'



dotenv.config()

const app = express()
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'], // Add detailed logging
})

// Middleware
app.use(cors({
  origin: 'http://localhost:3006',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/users', userRoutes)
app.use('/api/admin', superAdminRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/businesses', businessRoutes)
app.use('/api/business-types', businessTypeRoutes)
app.use('/api/business-services', businessServiceRoutes)
app.use('/api/worker-types', workerTypeRoutes) 
app.use('/api/business-workers', businessWorkerRoutes)
app.use('/api/business-ratings', businessRatingRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server ayakta 👌' })
})

// Server başlatıcı
const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    console.log('🔁 Server başlatılıyor...')
    
    await prisma.$connect()
    console.log('📡 Veritabanına başarıyla bağlanıldı.')

    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor...`)
    })
  } catch (error) {
    console.error('Server başlatılamadı:', error)
    process.exit(1)
  }
}

startServer()
