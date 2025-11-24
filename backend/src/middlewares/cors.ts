import cors from 'cors'
import { env } from '../utils/env'
import { Request } from 'express'

/**
 * Configuração CORS
 */
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Permitir requisições sem origin (mobile apps, Postman, etc)
    if (!origin) {
      return callback(null, true)
    }

    // Lista de origens permitidas
    const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim())

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true, // Permitir cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

export default cors(corsOptions)

