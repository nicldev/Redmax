import { PrismaClient } from '@prisma/client'
import logger from '../utils/logger'

// Instância única do Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
})

// Conectar ao banco de dados
prisma.$connect()
  .then(() => {
    logger.info('✅ Connected to database')
  })
  .catch((error) => {
    logger.error('❌ Database connection error:', error)
    process.exit(1)
  })

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
  logger.info('Database connection closed')
})

export default prisma

