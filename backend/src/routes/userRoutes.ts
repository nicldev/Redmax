import { Router } from 'express'
import {
  getProfile,
  updateProfile,
  changePasswordHandler,
  deleteAccount,
} from '../controllers/userController'
import { validate } from '../middlewares/validate'
import { authenticate, requireEmailVerified } from '../middlewares/auth'
import {
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from '../validators/authValidators'

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticate)
router.use(requireEmailVerified)

// GET /api/user/profile
router.get('/profile', getProfile)

// PUT /api/user/profile
router.put('/profile', validate(updateProfileSchema), updateProfile)

// PUT /api/user/change-password
router.put('/change-password', validate(changePasswordSchema), changePasswordHandler)

// DELETE /api/user
router.delete('/', validate(deleteAccountSchema), deleteAccount)

export default router

