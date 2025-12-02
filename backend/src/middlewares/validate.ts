import { Request, Response, NextFunction } from 'express'
import { z, ZodSchema } from 'zod'
import { sanitizeObject } from '../utils/sanitize'

/**
 * Middleware de validação usando Zod
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanitizar e validar body
      const sanitized = sanitizeObject(req.body)
      const validated = schema.parse(sanitized)
      
      // Substituir body pelo objeto validado
      req.body = validated
      
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        })
      }
      
      next(error)
    }
  }
}

/**
 * Middleware para validar query parameters
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const sanitized = sanitizeObject(req.query)
      const validated = schema.parse(sanitized)
      
      req.query = validated as any
      
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Parâmetros de query inválidos',
          errors: error.errors,
        })
      }
      
      next(error)
    }
  }
}

