import dotenv from 'dotenv'
import logger from './logger'

// Carregar variáveis de ambiente
dotenv.config()

// Interface para variáveis de ambiente necessárias
interface EnvConfig {
  NODE_ENV: string
  PORT: number
  DATABASE_URL: string
  ACCESS_TOKEN_SECRET: string
  REFRESH_TOKEN_SECRET: string
  ACCESS_TOKEN_EXPIRES_IN: number
  REFRESH_TOKEN_EXPIRES_IN: number
  SMTP_HOST: string
  SMTP_PORT: number
  SMTP_USER: string
  SMTP_PASS: string
  SMTP_FROM_EMAIL: string
  SMTP_FROM_NAME: string
  FRONTEND_URL: string
  CORS_ORIGIN: string
  RATE_LIMIT_WINDOW_MS: number
  RATE_LIMIT_MAX_REQUESTS: number
}

// Validar e extrair variáveis de ambiente
function getEnvConfig(): EnvConfig {
  const requiredEnvVars = [
    'DATABASE_URL',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM_EMAIL',
    'FRONTEND_URL',
  ]

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    logger.error(`Missing required environment variables: ${missingVars.join(', ')}`)
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }

  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),
    DATABASE_URL: process.env.DATABASE_URL!,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
    ACCESS_TOKEN_EXPIRES_IN: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN || '900', 10),
    REFRESH_TOKEN_EXPIRES_IN: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || '2592000', 10),
    SMTP_HOST: process.env.SMTP_HOST!,
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '2525', 10),
    SMTP_USER: process.env.SMTP_USER!,
    SMTP_PASS: process.env.SMTP_PASS!,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL!,
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || 'RedaIA',
    FRONTEND_URL: process.env.FRONTEND_URL!,
    CORS_ORIGIN: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  }
}

export const env = getEnvConfig()

