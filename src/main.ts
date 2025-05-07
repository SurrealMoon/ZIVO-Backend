import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
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
import businessReviewRoutes from './routes/businessReviews-routes'
import businessContactRoutes from './routes/businessContacts-routes'
import businessCalendarRoutes from './routes/businessCalendar-routes'
import businessPortfolioRoutes from './routes/businessPortfolio-routes'
import appointmentRoutes from './routes/appointments-routes'
import mediaRoutes from './routes/media-routes'


dotenv.config()

const app = express()
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
})

app.use(helmet())

// Rate limiting önlemleri
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Her IP için max 100 istek
  standardHeaders: true,   
  legacyHeaders: false, 
})
app.use('/api', limiter)

// CORS ayarları
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3006']

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS policy violation'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
}

app.use(cors(corsOptions))

// Diğer middleware'ler
app.use(express.json())
app.use(cookieParser())

// Route'lar
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
app.use('/api/business-reviews', businessReviewRoutes)
app.use('/api/business-contacts', businessContactRoutes)
app.use('/api/business-calendar', businessCalendarRoutes)
app.use('/api/business-portfolio', businessPortfolioRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/media', mediaRoutes)


app.get('/api/health', (req, res) => {
  res.json({ status: 'Server ayakta!' })
})

// Server başlatıcı
const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    console.log('Server başlatılıyor...')

    await prisma.$connect()
    console.log('Veritabanına başarıyla bağlanıldı.')

    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor...`)
    })
  } catch (error) {
    console.error('Server başlatılamadı:', error)
    process.exit(1)
  }
}

startServer()
