import { z } from 'zod'

/**
 * Validação para registro de usuário
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string()
    .email('E-mail inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'
    ),
  school: z
    .string()
    .max(200, 'Nome da escola deve ter no máximo 200 caracteres')
    .optional(),
  grade: z
    .string()
    .max(50, 'Série deve ter no máximo 50 caracteres')
    .optional(),
})

/**
 * Validação para login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('E-mail inválido')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Senha é obrigatória'),
})

/**
 * Validação para refresh token
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
})

/**
 * Validação para atualização de perfil
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .optional(),
  school: z
    .string()
    .max(200, 'Nome da escola deve ter no máximo 200 caracteres')
    .optional(),
  grade: z
    .string()
    .max(50, 'Série deve ter no máximo 50 caracteres')
    .optional(),
})

/**
 * Validação para mudança de senha
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z
    .string()
    .min(8, 'Nova senha deve ter no mínimo 8 caracteres')
    .max(100, 'Nova senha deve ter no máximo 100 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Nova senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'
    ),
})

/**
 * Validação para deletar conta
 */
export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Senha é obrigatória para confirmar exclusão'),
})

