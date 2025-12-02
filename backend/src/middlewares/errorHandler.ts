import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

/**
 * Middleware centralizado para tratamento de erros
 */
export function errorHandler(
  err: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log do erro (sem dados sensíveis)
  logger.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  })

  // Erro de validação (Zod)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: err.errors,
    })
  }

  // Erro de autenticação JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado',
    })
  }

  // Erros do Prisma
  if (err.code) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          message: 'Este e-mail já está cadastrado',
        })
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Registro não encontrado',
        })
      case 'P2003':
        return res.status(400).json({
          success: false,
          message: 'Referência inválida no banco de dados',
        })
      default:
        // Outros erros do Prisma
        logger.error('Prisma error:', err.code, err.message)
    }
  }

  // Erro customizado com status code
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || 'Erro na requisição',
    })
  }

  // Erro genérico
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor'
      : err.message,
  })
}

/**
 * Middleware para rotas não encontradas
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  })
}

