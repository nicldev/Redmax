import request from 'supertest'
import { createApp } from '../src/app'
import prisma from '../src/models/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '../src/utils/env'

const app = createApp()

describe('User Endpoints', () => {
  let accessToken: string
  let userId: string

  beforeEach(async () => {
    // Limpar banco
    await prisma.refreshToken.deleteMany()
    await prisma.emailVerification.deleteMany()
    await prisma.user.deleteMany()

    // Criar usuário de teste
    const passwordHash = await bcrypt.hash('Password123', 12)
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        passwordHash,
        emailVerified: true,
        school: 'Escola Teste',
        grade: '3º Ano',
      },
    })

    userId = user.id

    // Gerar access token
    accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    )
  })

  describe('GET /api/user/profile', () => {
    it('deve retornar perfil do usuário autenticado', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe('test@example.com')
      expect(response.body.data.user.passwordHash).toBeUndefined()
    })

    it('deve rejeitar requisição sem token', async () => {
      const response = await request(app)
        .get('/api/user/profile')

      expect(response.status).toBe(401)
    })
  })

  describe('PUT /api/user/profile', () => {
    it('deve atualizar perfil do usuário', async () => {
      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Updated Name',
          school: 'Nova Escola',
          grade: '2º Ano',
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.user.name).toBe('Updated Name')
      expect(response.body.data.user.school).toBe('Nova Escola')

      // Verificar no banco
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
      })
      expect(updatedUser?.name).toBe('Updated Name')
    })
  })

  describe('PUT /api/user/change-password', () => {
    it('deve alterar senha com senha atual correta', async () => {
      const response = await request(app)
        .put('/api/user/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'Password123',
          newPassword: 'NewPassword123',
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)

      // Verificar se senha foi alterada
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })
      const passwordValid = await bcrypt.compare('NewPassword123', user!.passwordHash)
      expect(passwordValid).toBe(true)
    })

    it('deve rejeitar alteração com senha atual incorreta', async () => {
      const response = await request(app)
        .put('/api/user/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'WrongPassword',
          newPassword: 'NewPassword123',
        })

      expect(response.status).toBe(401)
      expect(response.body.message).toContain('Senha atual incorreta')
    })
  })

  describe('DELETE /api/user', () => {
    it('deve deletar conta com senha correta', async () => {
      const response = await request(app)
        .delete('/api/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          password: 'Password123',
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)

      // Verificar se usuário foi deletado
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })
      expect(user).toBeNull()
    })

    it('deve rejeitar deleção com senha incorreta', async () => {
      const response = await request(app)
        .delete('/api/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          password: 'WrongPassword',
        })

      expect(response.status).toBe(401)
    })
  })
})

