import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Limpar banco de dados antes dos testes
beforeAll(async () => {
  await prisma.refreshToken.deleteMany()
  await prisma.emailVerification.deleteMany()
  await prisma.user.deleteMany()
})

// Fechar conexão após todos os testes
afterAll(async () => {
  await prisma.$disconnect()
})

