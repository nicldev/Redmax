import { Request, Response } from 'express'
import { ThemeService } from '../services/themeService'
import logger from '../utils/logger'

export class ThemeController {
  /**
   * GET /api/themes/random
   * Retorna um tema aleatório de redação do ENEM
   */
  static async getRandomTheme(req: Request, res: Response) {
    try {
      const theme = await ThemeService.getRandomTheme()

      res.status(200).json({
        success: true,
        data: theme
      })
    } catch (error: any) {
      logger.error('Error in getRandomTheme:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar tema aleatório'
      })
    }
  }

  /**
   * GET /api/themes
   * Retorna todos os temas ativos
   */
  static async getAllThemes(req: Request, res: Response) {
    try {
      const themes = await ThemeService.getAllThemes()

      res.status(200).json({
        success: true,
        data: themes,
        count: themes.length
      })
    } catch (error: any) {
      logger.error('Error in getAllThemes:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar temas'
      })
    }
  }

  /**
   * GET /api/themes/:id
   * Retorna um tema específico por ID
   */
  static async getThemeById(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID do tema é obrigatório'
        })
      }

      const theme = await ThemeService.getThemeById(id)

      res.status(200).json({
        success: true,
        data: theme
      })
    } catch (error: any) {
      logger.error('Error in getThemeById:', error)
      
      if (error.message === 'Tema não encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        })
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar tema'
      })
    }
  }
}

