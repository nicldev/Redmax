import request from 'supertest'
import { createApp } from '../src/app'
import prisma from '../src/models/prisma'
import bcrypt from 'bcrypt'

const app = createApp()

describe('Auth Endpoints', () => {
  // Limpar banco antes de cada teste
  beforeEach(async () => {
    await prisma.refreshToken.deleteMany()
    await prisma.emailVerification.deleteMany()
    await prisma.user.deleteMany()
  })

  describe('POST /api/auth/register', () => {
    it('deve registrar novo usuário com sucesso', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123',
          school: 'Escola Teste',
          grade: '3º Ano',
        })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe('test@example.com')
      expect(response.body.data.user.passwordHash).toBeUndefined()

      // Verificar se usuário foi criado
      const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' },
      })
      expect(user).toBeTruthy()
      expect(user?.emailVerified).toBe(false)

      // Verificar se token de verificação foi criado
      const verification = await prisma.emailVerification.findFirst({
        where: { userId: user!.id },
      })
      expect(verification).toBeTruthy()
    })

    it('deve rejeitar registro com e-mail duplicado', async () => {
      // Criar usuário primeiro
      await prisma.user.create({
        data: {
          name: 'Existing User',
          email: 'existing@example.com',
          passwordHash: await bcrypt.hash('Password123', 12),
        },
      })

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'existing@example.com',
          password: 'Password123',
        })

      expect(response.status).toBe(409)
    })

    it('deve rejeitar registro com dados inválidos', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'A', // Muito curto
          email: 'invalid-email', // E-mail inválido
          password: '123', // Senha muito curta
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /api/auth/verify-email', () => {
    it('deve verificar e-mail com token válido', async () => {
      // Criar usuário e token de verificação
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: await bcrypt.hash('Password123', 12),
          emailVerified: false,
        },
      })

      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      const verification = await prisma.emailVerification.create({
        data: {
          userId: user.id,
          token: 'test-verification-token',
          expiresAt,
        },
      })

      const response = await request(app)
        .get(`/api/auth/verify-email?token=${verification.token}`)

      expect(response.status).toBe(200)
      expect(response.text).toContain('E-mail Verificado')

      // Verificar se usuário foi marcado como verificado
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      })
      expect(updatedUser?.emailVerified).toBe(true)

      // Verificar se token foi deletado
      const deletedVerification = await prisma.emailVerification.findUnique({
        where: { id: verification.id },
      })
      expect(deletedVerification).toBeNull()
    })

    it('deve rejeitar token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/verify-email?token=invalid-token')

      expect(response.status).toBe(404)
      expect(response.text).toContain('Erro na Verificação')
    })
  })

  describe('POST /api/auth/login', () => {
    it('deve fazer login com credenciais válidas e e-mail verificado', async () => {
      // Criar usuário verificado
      const passwordHash = await bcrypt.hash('Password123', 12)
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          passwordHash,
          emailVerified: true,
        },
      })

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123',
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.accessToken).toBeTruthy()
      expect(response.body.data.user.email).toBe('test@example.com')

      // Verificar se refresh token foi criado
      const refreshTokens = await prisma.refreshToken.findMany({
        where: { userId: user.id },
      })
      expect(refreshTokens.length).toBeGreaterThan(0)
    })

    it('deve rejeitar login com e-mail não verificado', async () => {
      // Criar usuário não verificado
      const passwordHash = await bcrypt.hash('Password123', 12)
      await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          passwordHash,
          emailVerified: false,
        },
      })

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123',
        })

      expect(response.status).toBe(403)
      expect(response.body.message).toContain('E-mail não verificado')
    })

    it('deve rejeitar login com credenciais inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'WrongPassword',
        })

      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/auth/refresh', () => {
    it('deve renovar access token com refresh token válido', async () => {
      // Criar usuário e refresh token
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: await bcrypt.hash('Password123', 12),
          emailVerified: true,
        },
      })

      const refreshToken = 'test-refresh-token'
      const refreshTokenHash = await bcrypt.hash(refreshToken, 12)

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: refreshTokenHash,
          expiresAt,
        },
      })

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken,
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.accessToken).toBeTruthy()

      // Verificar se token antigo foi revogado
      const oldTokens = await prisma.refreshToken.findMany({
        where: {
          userId: user.id,
          revokedAt: { not: null },
        },
      })
      expect(oldTokens.length).toBeGreaterThan(0)
    })
  })

  describe('POST /api/auth/logout', () => {
    it('deve fazer logout e revogar refresh token', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: await bcrypt.hash('Password123', 12),
          emailVerified: true,
        },
      })

      const refreshToken = 'test-refresh-token'
      const refreshTokenHash = await bcrypt.hash(refreshToken, 12)

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: refreshTokenHash,
          expiresAt,
        },
      })

      const response = await request(app)
        .post('/api/auth/logout')
        .send({
          refreshToken,
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)

      // Verificar se token foi revogado
      const revokedTokens = await prisma.refreshToken.findMany({
        where: {
          userId: user.id,
          revokedAt: { not: null },
        },
      })
      expect(revokedTokens.length).toBeGreaterThan(0)
    })
  })
})

