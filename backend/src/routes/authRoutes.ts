import { Router } from 'express'
import {
  register,
  verifyEmailHandler,
  login,
  refresh,
  logout,
  resendVerification,
} from '../controllers/authController'
import { validate } from '../middlewares/validate'
import { validateQuery } from '../middlewares/validate'
import { authRateLimiter } from '../middlewares/rateLimit'
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../validators/authValidators'
import { authenticate } from '../middlewares/auth'
import { z } from 'zod'

const router = Router()

// POST /api/auth/register
router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  register
)

// GET /api/auth/verify-email
router.get(
  '/verify-email',
  validateQuery(
    z.object({
      token: z.string().min(1, 'Token é obrigatório'),
    })
  ),
  verifyEmailHandler
)

// POST /api/auth/login
router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  login
)

// POST /api/auth/refresh
router.post(
  '/refresh',
  validate(refreshTokenSchema),
  refresh
)

// POST /api/auth/logout
router.post(
  '/logout',
  logout
)

// POST /api/auth/resend-verification (requer autenticação)
router.post(
  '/resend-verification',
  authenticate,
  resendVerification
)

export default router

