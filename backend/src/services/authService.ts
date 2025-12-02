import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { env } from '../utils/env'
import prisma from '../models/prisma'
import { emailService } from '../utils/email'
import logger from '../utils/logger'

const SALT_ROUNDS = 12

/**
 * Gera hash da senha usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compara senha com hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Gera access token JWT
 */
export function generateAccessToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN }
  )
}

/**
 * Gera refresh token (UUID)
 */
export function generateRefreshToken(): string {
  return uuidv4()
}

/**
 * Hash do refresh token para armazenamento seguro
 */
export async function hashRefreshToken(token: string): Promise<string> {
  return bcrypt.hash(token, SALT_ROUNDS)
}

/**
 * Compara refresh token com hash
 */
export async function compareRefreshToken(
  token: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(token, hash)
}

/**
 * Registra novo usuário
 */
export async function registerUser(data: {
  name: string
  email: string
  password: string
  school?: string
  grade?: string
}) {
  // Verificar se e-mail já existe
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    throw { statusCode: 409, message: 'Este e-mail já está cadastrado' }
  }

  // Hash da senha
  const passwordHash = await hashPassword(data.password)

  // Em desenvolvimento, marcar email como verificado automaticamente (SMTP não está configurado)
  // Em produção, email deve ser verificado via link enviado por email
  const shouldAutoVerify = process.env.NODE_ENV !== 'production'

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      school: data.school,
      grade: data.grade,
      emailVerified: shouldAutoVerify, // Auto-verificar em desenvolvimento
    },
  })

  // Criar token de verificação apenas se não for auto-verificado (para produção)
  if (!shouldAutoVerify) {
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    const emailVerification = await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token: uuidv4(),
        expiresAt,
      },
    })

    // Enviar e-mail de verificação
    try {
      await emailService.sendVerificationEmail({
        email: user.email,
        name: user.name,
        token: emailVerification.token,
      })
    } catch (error) {
      logger.error('Failed to send verification email:', error)
      // Não falhar o registro se o e-mail não for enviado
    }
  } else {
    logger.info(`User ${user.email} automatically verified (development mode)`)
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
  }
}

/**
 * Verifica e-mail do usuário
 */
export async function verifyEmail(token: string) {
  // Buscar verificação
  const verification = await prisma.emailVerification.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!verification) {
    throw { statusCode: 404, message: 'Token de verificação inválido' }
  }

  // Verificar se expirou
  if (new Date() > verification.expiresAt) {
    // Deletar token expirado
    await prisma.emailVerification.delete({
      where: { id: verification.id },
    })
    throw { statusCode: 400, message: 'Token de verificação expirado' }
  }

  // Verificar se já foi verificado
  if (verification.user.emailVerified) {
    // Deletar token já usado
    await prisma.emailVerification.delete({
      where: { id: verification.id },
    })
    throw { statusCode: 400, message: 'E-mail já foi verificado' }
  }

  // Atualizar usuário e deletar token em transação
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: verification.userId },
      data: { emailVerified: true },
    })

    await tx.emailVerification.delete({
      where: { id: verification.id },
    })
  })

  return { success: true }
}

/**
 * Login do usuário
 */
export async function loginUser(email: string, password: string) {
  // Buscar usuário
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw { statusCode: 401, message: 'E-mail ou senha incorretos' }
  }

  // Verificar senha
  const passwordValid = await comparePassword(password, user.passwordHash)

  if (!passwordValid) {
    throw { statusCode: 401, message: 'E-mail ou senha incorretos' }
  }

  // Verificar se e-mail foi verificado (obrigatório apenas em produção)
  if (!user.emailVerified && process.env.NODE_ENV === 'production') {
    throw {
      statusCode: 403,
      message: 'E-mail não verificado. Verifique seu e-mail ou solicite novo link.',
    }
  }
  
  // Em desenvolvimento, permitir login mesmo sem verificação (mas avisar)
  if (!user.emailVerified) {
    logger.warn(`User ${user.email} logged in without email verification (development mode)`)
  }

  // Gerar tokens
  const accessToken = generateAccessToken(user.id, user.email)
  const refreshToken = generateRefreshToken()
  const refreshTokenHash = await hashRefreshToken(refreshToken)

  // Calcular expiração do refresh token (30 dias)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  // Salvar refresh token no banco
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt,
    },
  })

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      school: user.school,
      grade: user.grade,
    },
  }
}

/**
 * Renova access token usando refresh token
 */
export async function refreshAccessToken(refreshToken: string) {
  // Buscar todos os refresh tokens do usuário (não revogados e não expirados)
  const tokens = await prisma.refreshToken.findMany({
    where: {
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  })

  // Encontrar token correspondente
  let matchedToken = null
  let matchedUser = null

  for (const token of tokens) {
    const isValid = await compareRefreshToken(refreshToken, token.tokenHash)
    if (isValid) {
      matchedToken = token
      matchedUser = token.user
      break
    }
  }

  if (!matchedToken || !matchedUser) {
    throw { statusCode: 401, message: 'Refresh token inválido ou expirado' }
  }

  // Verificar se usuário ainda existe e está ativo
  if (!matchedUser.emailVerified) {
    throw { statusCode: 403, message: 'Usuário não verificado' }
  }

  // Revogar token antigo e criar novo (rotação)
  const newRefreshToken = generateRefreshToken()
  const newRefreshTokenHash = await hashRefreshToken(newRefreshToken)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  await prisma.$transaction(async (tx) => {
    // Revogar token antigo
    await tx.refreshToken.update({
      where: { id: matchedToken.id },
      data: { revokedAt: new Date() },
    })

    // Criar novo refresh token
    await tx.refreshToken.create({
      data: {
        userId: matchedUser.id,
        tokenHash: newRefreshTokenHash,
        expiresAt,
      },
    })
  })

  // Gerar novo access token
  const accessToken = generateAccessToken(matchedUser.id, matchedUser.email)

  return {
    accessToken,
    refreshToken: newRefreshToken,
  }
}

/**
 * Revoga refresh token (logout)
 */
export async function revokeRefreshToken(refreshToken: string) {
  // Buscar todos os refresh tokens não revogados
  const tokens = await prisma.refreshToken.findMany({
    where: {
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
  })

  // Encontrar e revogar token correspondente
  for (const token of tokens) {
    const isValid = await compareRefreshToken(refreshToken, token.tokenHash)
    if (isValid) {
      await prisma.refreshToken.update({
        where: { id: token.id },
        data: { revokedAt: new Date() },
      })
      return { success: true }
    }
  }

  // Token não encontrado, mas não é erro crítico
  return { success: true }
}

/**
 * Reenvia e-mail de verificação
 */
export async function resendVerificationEmail(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw { statusCode: 404, message: 'Usuário não encontrado' }
  }

  if (user.emailVerified) {
    throw { statusCode: 400, message: 'E-mail já verificado' }
  }

  // Deletar tokens antigos de verificação
  await prisma.emailVerification.deleteMany({
    where: { userId: user.id },
  })

  // Criar novo token
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24)

  const emailVerification = await prisma.emailVerification.create({
    data: {
      userId: user.id,
      token: uuidv4(),
      expiresAt,
    },
  })

  // Enviar e-mail
  try {
    await emailService.sendVerificationEmail({
      email: user.email,
      name: user.name,
      token: emailVerification.token,
    })
  } catch (error) {
    logger.error('Failed to send verification email:', error)
    throw { statusCode: 500, message: 'Erro ao enviar e-mail de verificação' }
  }

  return { success: true }
}

