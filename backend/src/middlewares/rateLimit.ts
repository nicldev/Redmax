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
 */
export const generalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 minutos
  max: env.RATE_LIMIT_MAX_REQUESTS, // 100 requisições
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em alguns minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

