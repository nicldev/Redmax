import { z } from 'zod'

/**
 * Validação para criar redação
 */
export const createEssaySchema = z.object({
  themeId: z
    .string()
    .min(1, 'ID do tema é obrigatório')
    .optional(),
  title: z
    .string()
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .optional()
    .nullable(),
  content: z
    .string()
    .min(100, 'A redação deve ter no mínimo 100 caracteres')
    .max(10000, 'A redação deve ter no máximo 10000 caracteres')
    .trim(),
})

/**
 * Validação para atualizar redação
 */
export const updateEssaySchema = z.object({
  title: z
    .string()
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .optional()
    .nullable(),
  content: z
    .string()
    .min(100, 'A redação deve ter no mínimo 100 caracteres')
    .max(10000, 'A redação deve ter no máximo 10000 caracteres')
    .trim()
    .optional(),
  themeId: z
    .string()
    .min(1, 'ID do tema é obrigatório')
    .optional(),
})

/**
 * Validação para query parameters de listagem
 * Aceita strings ou valores undefined
 */
export const listEssaysSchema = z.object({
  themeId: z.string().optional(),
  isEvaluated: z
    .union([z.string(), z.undefined()])
    .transform((val) => val === 'true')
    .optional(),
  limit: z
    .union([z.string(), z.undefined()])
    .transform((val) => val ? parseInt(val, 10) : undefined)
    .refine((val) => val === undefined || (!isNaN(val) && val > 0 && val <= 100), {
      message: 'Limit deve ser um número entre 1 e 100',
    })
    .optional(),
  offset: z
    .union([z.string(), z.undefined()])
    .transform((val) => val ? parseInt(val, 10) : undefined)
    .refine((val) => val === undefined || (!isNaN(val) && val >= 0), {
      message: 'Offset deve ser um número maior ou igual a 0',
    })
    .optional(),
  orderBy: z.enum(['createdAt', 'totalScore']).optional(),
  orderDirection: z.enum(['asc', 'desc']).optional(),
}).passthrough() // Permite outros query params sem validar

