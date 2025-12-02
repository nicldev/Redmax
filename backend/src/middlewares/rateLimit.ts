import rateLimit from 'express-rate-limit'
import { env } from '../utils/env'

/**
 * Rate limiter para endpoints de autenticação
 * Previne ataques de força bruta
 */
export const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 minutos
  max: 5, // 5 tentativas por IP
  message: {
    success: false,
    message: 'Muitas tentativas. Tente novamente em alguns minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * Rate limiter geral para todas as rotas
 * Mais permissivo para evitar bloquear uso normal do sistema
 */
export const generalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 minutos
  max: env.RATE_LIMIT_MAX_REQUESTS * 3, // 300 requisições (triplicado para permitir uso normal)
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em alguns minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Pular rate limit para requisições GET (leitura) em desenvolvimento
    if (process.env.NODE_ENV === 'development' && req.method === 'GET') {
      return true
    }
    return false
  },
})

/**
 * Rate limiter específico para avaliação de redação
 * Mais permissivo pois avaliação é uma operação pesada
 */
export const essayEvaluationRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // 5 avaliações por minuto por IP
  message: {
    success: false,
    message: 'Você já fez muitas avaliações recentemente. Aguarde um momento antes de avaliar outra redação.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => {
    // Pular rate limit em desenvolvimento para facilitar testes
    return process.env.NODE_ENV === 'development'
  },
})
