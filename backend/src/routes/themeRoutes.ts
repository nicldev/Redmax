import { Router } from 'express'
import { ThemeController } from '../controllers/themeController'

const router = Router()

/**
 * @route   GET /api/themes/random
 * @desc    Retorna um tema aleatório de redação do ENEM
 * @access  Public
 */
router.get('/random', ThemeController.getRandomTheme)

/**
 * @route   GET /api/themes
 * @desc    Retorna todos os temas ativos
 * @access  Public
 */
router.get('/', ThemeController.getAllThemes)

/**
 * @route   GET /api/themes/:id
 * @desc    Retorna um tema específico por ID
 * @access  Public
 */
router.get('/:id', ThemeController.getThemeById)

export default router

