import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import cors from './middlewares/cors'
import { generalRateLimiter } from './middlewares/rateLimit'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import themeRoutes from './routes/themeRoutes'
import essayRoutes from './routes/essayRoutes'
import logger from './utils/logger'

/**
 * Configuração da aplicação Express
 */
export function createApp(): Express {
  const app = express()

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }))

  // CORS
  app.use(cors)

  // Rate limiting geral
  app.use(generalRateLimiter)

  // Body parser
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  // Cookie parser (para refresh tokens)
  app.use(cookieParser())

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
    })
  })

  // API Routes
  app.use('/api/auth', authRoutes)
  app.use('/api/user', userRoutes)
  app.use('/api/themes', themeRoutes)
  app.use('/api/essays', essayRoutes)

  // 404 handler
  app.use(notFoundHandler)

  // Error handler (deve ser o último middleware)
  app.use(errorHandler)

  logger.info('✅ Express app configured')

  return app
}

