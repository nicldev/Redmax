import { createApp } from './app'
import { env } from './utils/env'
import logger from './utils/logger'
import { ThemeService } from './services/themeService'

// Criar aplicação Express
const app = createApp()

// Iniciar servidor
const PORT = env.PORT

const server = app.listen(PORT, async () => {
  logger.info(`🚀 Server running on port ${PORT}`)
  logger.info(`📝 Environment: ${env.NODE_ENV}`)
  logger.info(`🌐 API URL: http://localhost:${PORT}`)
  
  // Inicializar temas do ENEM
  try {
    await ThemeService.seedThemes()
  } catch (error) {
    logger.error('Error seeding themes:', error)
  }
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    logger.info('HTTP server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server')
  server.close(() => {
    logger.info('HTTP server closed')
    process.exit(0)
  })
})

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

