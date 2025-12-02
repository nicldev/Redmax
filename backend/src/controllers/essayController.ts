import { Request, Response } from 'express'
import { EssayService } from '../services/essayService'
import logger from '../utils/logger'

// Usa o tipo Request global do Express que já tem req.user definido pelo middleware auth.ts

export class EssayController {
  /**
   * POST /api/essays
   * Cria uma nova redação
   */
  static async createEssay(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        })
      }

      const { themeId, title, content } = req.body

      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'O conteúdo da redação é obrigatório'
        })
      }

      const essay = await EssayService.createEssay(userId, {
        themeId,
        title,
        content: content.trim()
      })

      res.status(201).json({
        success: true,
        data: essay
      })
    } catch (error: any) {
      logger.error('Error in createEssay:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao criar redação'
      })
    }
  }

  /**
   * GET /api/essays
   * Lista redações do usuário
   */
  static async listEssays(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        })
      }

      const { themeId, isEvaluated, limit, offset, orderBy, orderDirection } = req.query

      const filters: any = {}
      
      if (themeId && typeof themeId === 'string') {
        filters.themeId = themeId
      }

      if (isEvaluated !== undefined) {
        filters.isEvaluated = isEvaluated === 'true'
      }

      if (limit) {
        filters.limit = parseInt(limit as string, 10)
      }

      if (offset) {
        filters.offset = parseInt(offset as string, 10)
      }

      if (orderBy && typeof orderBy === 'string') {
        filters.orderBy = orderBy as 'createdAt' | 'totalScore'
      }

      if (orderDirection && typeof orderDirection === 'string') {
        filters.orderDirection = orderDirection as 'asc' | 'desc'
      }

      const result = await EssayService.listEssays(userId, filters)

      res.status(200).json({
        success: true,
        data: result.essays,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          hasMore: result.offset + result.essays.length < result.total
        }
      })
    } catch (error: any) {
      logger.error('Error in listEssays:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao listar redações'
      })
    }
  }

  /**
   * GET /api/essays/:id
   * Busca uma redação específica
   */
  static async getEssayById(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        })
      }

      const { id } = req.params

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID da redação é obrigatório'
        })
      }

      const essay = await EssayService.getEssayById(id, userId)

      // Parse dos arrays JSON armazenados como strings
      let strongPoints: string[] = []
      let improvements: string[] = []
      
      try {
        if (essay.strongPoints) {
          strongPoints = typeof essay.strongPoints === 'string' 
            ? JSON.parse(essay.strongPoints) 
            : essay.strongPoints
        }
      } catch (e) {
        logger.warn('Error parsing strongPoints:', e)
      }
      
      try {
        if (essay.improvements) {
          improvements = typeof essay.improvements === 'string' 
            ? JSON.parse(essay.improvements) 
            : essay.improvements
        }
      } catch (e) {
        logger.warn('Error parsing improvements:', e)
      }
      
      const essayData = {
        ...essay,
        strongPoints,
        improvements
      }

      res.status(200).json({
        success: true,
        data: essayData
      })
    } catch (error: any) {
      logger.error('Error in getEssayById:', error)
      
      if (error.message === 'Redação não encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        })
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar redação'
      })
    }
  }

  /**
   * PUT /api/essays/:id
   * Atualiza uma redação
   */
  static async updateEssay(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        })
      }

      const { id } = req.params
      const { title, content, themeId } = req.body

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID da redação é obrigatório'
        })
      }

      const updateData: any = {}
      
      if (title !== undefined) {
        updateData.title = title
      }

      if (content !== undefined) {
        if (typeof content !== 'string' || content.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: 'O conteúdo da redação não pode estar vazio'
          })
        }
        updateData.content = content.trim()
      }

      if (themeId !== undefined) {
        updateData.themeId = themeId
      }

      const essay = await EssayService.updateEssay(id, userId, updateData)

      // Parse dos arrays JSON
      let strongPoints: string[] = []
      let improvements: string[] = []
      
      try {
        if (essay.strongPoints) {
          strongPoints = typeof essay.strongPoints === 'string' 
            ? JSON.parse(essay.strongPoints) 
            : essay.strongPoints
        }
      } catch (e) {
        logger.warn('Error parsing strongPoints:', e)
      }
      
      try {
        if (essay.improvements) {
          improvements = typeof essay.improvements === 'string' 
            ? JSON.parse(essay.improvements) 
            : essay.improvements
        }
      } catch (e) {
        logger.warn('Error parsing improvements:', e)
      }
      
      const essayData = {
        ...essay,
        strongPoints,
        improvements
      }

      res.status(200).json({
        success: true,
        data: essayData
      })
    } catch (error: any) {
      logger.error('Error in updateEssay:', error)
      
      if (error.message.includes('não encontrada') || error.message.includes('não tem permissão')) {
        return res.status(404).json({
          success: false,
          message: error.message
        })
      }

      if (error.message.includes('não é possível editar')) {
        return res.status(400).json({
          success: false,
          message: error.message
        })
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao atualizar redação'
      })
    }
  }

  /**
   * POST /api/essays/:id/evaluate
   * Avalia uma redação usando IA
   */
  static async evaluateEssay(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        })
      }

      const { id } = req.params

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID da redação é obrigatório'
        })
      }

      const essay = await EssayService.evaluateEssay(id, userId)

      // Parse dos arrays JSON
      let strongPoints: string[] = []
      let improvements: string[] = []
      
      try {
        if (essay.strongPoints) {
          strongPoints = typeof essay.strongPoints === 'string' 
            ? JSON.parse(essay.strongPoints) 
            : essay.strongPoints
        }
      } catch (e) {
        logger.warn('Error parsing strongPoints:', e)
      }
      
      try {
        if (essay.improvements) {
          improvements = typeof essay.improvements === 'string' 
            ? JSON.parse(essay.improvements) 
            : essay.improvements
        }
      } catch (e) {
        logger.warn('Error parsing improvements:', e)
      }
      
      const essayData = {
        ...essay,
        strongPoints,
        improvements
      }

      res.status(200).json({
        success: true,
        data: essayData,
        message: 'Redação avaliada com sucesso'
      })
    } catch (error: any) {
      logger.error('Error in evaluateEssay:', error)
      logger.error('Error stack:', error?.stack)
      logger.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
      
      // Verificar se error.message existe antes de usar includes
      const errorMessage = error?.message || error?.toString() || 'Erro ao avaliar redação'
      
      if (errorMessage.includes('não encontrada') || errorMessage.includes('não tem permissão')) {
        return res.status(404).json({
          success: false,
          message: errorMessage
        })
      }

      if (errorMessage.includes('precisa ter pelo menos')) {
        return res.status(400).json({
          success: false,
          message: errorMessage
        })
      }

      if (errorMessage.includes('IA não configurado') || errorMessage.includes('GEMINI_API_KEY')) {
        return res.status(503).json({
          success: false,
          message: errorMessage
        })
      }

      // Em desenvolvimento, retornar a mensagem completa para debug
      const finalMessage = process.env.NODE_ENV === 'development' 
        ? errorMessage 
        : 'Erro ao avaliar redação com IA. Tente novamente.'

      res.status(500).json({
        success: false,
        message: finalMessage
      })
    }
  }

  /**
   * DELETE /api/essays/:id
   * Deleta uma redação
   */
  static async deleteEssay(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        })
      }

      const { id } = req.params

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID da redação é obrigatório'
        })
      }

      await EssayService.deleteEssay(id, userId)

      res.status(200).json({
        success: true,
        message: 'Redação deletada com sucesso'
      })
    } catch (error: any) {
      logger.error('Error in deleteEssay:', error)
      
      if (error.message.includes('não encontrada') || error.message.includes('não tem permissão')) {
        return res.status(404).json({
          success: false,
          message: error.message
        })
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao deletar redação'
      })
    }
  }

  /**
   * GET /api/essays/statistics
   * Retorna estatísticas das redações do usuário
   */
  static async getStatistics(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        })
      }

      const statistics = await EssayService.getStatistics(userId)

      res.status(200).json({
        success: true,
        data: statistics
      })
    } catch (error: any) {
      logger.error('Error in getStatistics:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar estatísticas'
      })
    }
  }
}

