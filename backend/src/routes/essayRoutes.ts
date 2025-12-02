import { Router } from 'express'
import { EssayController } from '../controllers/essayController'
import { authenticate, requireEmailVerified } from '../middlewares/auth'
import { validate, validateQuery } from '../middlewares/validate'
import { essayEvaluationRateLimiter } from '../middlewares/rateLimit'
import {
  createEssaySchema,
  updateEssaySchema,
  listEssaysSchema,
} from '../validators/essayValidators'

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticate)
router.use(requireEmailVerified)

/**
 * @route   GET /api/essays/statistics
 * @desc    Retorna estatísticas das redações do usuário
 * @access  Private
 */
router.get('/statistics', EssayController.getStatistics)

/**
 * @route   POST /api/essays/:id/evaluate
 * @desc    Avalia uma redação usando IA
 * @access  Private
 * IMPORTANTE: Esta rota deve vir ANTES de /:id para evitar conflito
 */
router.post('/:id/evaluate', essayEvaluationRateLimiter, EssayController.evaluateEssay)

/**
 * @route   GET /api/essays
 * @desc    Lista redações do usuário
 * @access  Private
 */
router.get('/', validateQuery(listEssaysSchema), EssayController.listEssays)

/**
 * @route   POST /api/essays
 * @desc    Cria uma nova redação
 * @access  Private
 */
router.post('/', validate(createEssaySchema), EssayController.createEssay)

/**
 * @route   GET /api/essays/:id
 * @desc    Busca uma redação específica
 * @access  Private
 */
router.get('/:id', EssayController.getEssayById)

/**
 * @route   PUT /api/essays/:id
 * @desc    Atualiza uma redação
 * @access  Private
 */
router.put('/:id', validate(updateEssaySchema), EssayController.updateEssay)

/**
 * @route   DELETE /api/essays/:id
 * @desc    Deleta uma redação
 * @access  Private
 */
router.delete('/:id', EssayController.deleteEssay)

export default router

