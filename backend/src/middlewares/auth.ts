import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../utils/env'
import prisma from '../models/prisma'
import logger from '../utils/logger'

// Estender interface Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        emailVerified: boolean
      }
    }
  }
}

/**
 * Middleware de autenticação JWT
 * Valida o token de acesso e adiciona informações do usuário ao request
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido',
      })
    }

    const token = authHeader.substring(7) // Remove "Bearer "

    // Verificar e decodificar token
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as {
      userId: string
      email: string
    }

    // Buscar usuário no banco (opcional, para garantir que ainda existe)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado',
      })
    }

    // Adicionar informações do usuário ao request
    req.user = {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    }

    next()
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
      })
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      })
    }

    logger.error('Auth middleware error:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro na autenticação',
    })
  }
}

/**
 * Middleware opcional para verificar se o e-mail foi verificado
 */
export function requireEmailVerified(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Não autenticado',
    })
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      message: 'E-mail não verificado. Verifique seu e-mail ou solicite novo link.',
    })
  }

  next()
}

