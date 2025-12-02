import prisma from '../models/prisma'
import logger from '../utils/logger'
import { serializeError } from '../utils/safeErrorSerializer'
import { ThemeService } from './themeService'

export class EssayService {
  static async createEssay(
    userId: string,
    data: {
      themeId?: string
      title?: string
      content: string
    }
  ) {
    try {
      let themeId = data.themeId
      if (!themeId) {
        const randomTheme = await ThemeService.getRandomTheme()
        themeId = randomTheme.id
      } else {
        await ThemeService.getThemeById(themeId)
      }

      // Calcula contagem de palavras e caracteres
      const wordCount = data.content.trim().split(/\s+/).filter(Boolean).length
      const charCount = data.content.length

      const essay = await prisma.essay.create({
        data: {
          userId,
          themeId,
          title: data.title || null,
          content: data.content,
          wordCount,
          charCount,
          isEvaluated: false
        },
        include: {
          theme: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      logger.info(`Essay created: ${essay.id} by user ${userId}`)
      return essay
    } catch (error) {
      logger.error('Error creating essay:', error)
      throw error
    }
  }

  static async updateEssay(
    essayId: string,
    userId: string,
    data: {
      title?: string
      content?: string
      themeId?: string
    }
  ) {
    try {
      const existingEssay = await prisma.essay.findFirst({
        where: {
          id: essayId,
          userId
        }
      })

      if (!existingEssay) {
        throw new Error('Redação não encontrada ou você não tem permissão para editá-la')
      }

      if (existingEssay.isEvaluated && data.content) {
        throw new Error('Não é possível editar uma redação já avaliada')
      }

      const updateData: any = {}
      
      if (data.title !== undefined) {
        updateData.title = data.title
      }

      if (data.content !== undefined) {
        updateData.content = data.content
        updateData.wordCount = data.content.trim().split(/\s+/).filter(Boolean).length
        updateData.charCount = data.content.length
        updateData.isEvaluated = false
        updateData.totalScore = null
        updateData.scoreC1 = null
        updateData.scoreC2 = null
        updateData.scoreC3 = null
        updateData.scoreC4 = null
        updateData.scoreC5 = null
        updateData.feedbackC1 = null
        updateData.feedbackC2 = null
        updateData.feedbackC3 = null
        updateData.feedbackC4 = null
        updateData.feedbackC5 = null
        updateData.strongPoints = null
        updateData.improvements = null
        updateData.rewriteSuggestion = null
        updateData.evaluatedAt = null
      }

      if (data.themeId !== undefined) {
        await ThemeService.getThemeById(data.themeId)
        updateData.themeId = data.themeId
      }

      const essay = await prisma.essay.update({
        where: {
          id: essayId
        },
        data: updateData,
        include: {
          theme: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      logger.info(`Essay updated: ${essayId}`)
      return essay
    } catch (error) {
      logger.error('Error updating essay:', error)
      throw error
    }
  }

  static async evaluateEssay(essayId: string, userId: string) {
    try {
      const essay = await prisma.essay.findFirst({
        where: {
          id: essayId,
          userId
        },
        include: {
          theme: true
        }
      })

      if (!essay) {
        throw new Error('Redação não encontrada ou você não tem permissão para avaliá-la')
      }

      if (!essay.content || essay.content.trim().length < 100) {
        throw new Error('A redação precisa ter pelo menos 100 caracteres para ser avaliada')
      }

      logger.info(`Evaluating essay ${essayId} with local automatic rules...`)

      const evaluation = EssayService.evaluateLocally(essay.content, essay.theme.title)

      const updatedEssay = await prisma.essay.update({
        where: {
          id: essayId
        },
        data: {
          isEvaluated: true,
          totalScore: evaluation.totalScore,
          scoreC1: evaluation.scores.c1,
          scoreC2: evaluation.scores.c2,
          scoreC3: evaluation.scores.c3,
          scoreC4: evaluation.scores.c4,
          scoreC5: evaluation.scores.c5,
          feedbackC1: evaluation.feedbacks.c1,
          feedbackC2: evaluation.feedbacks.c2,
          feedbackC3: evaluation.feedbacks.c3,
          feedbackC4: evaluation.feedbacks.c4,
          feedbackC5: evaluation.feedbacks.c5,
          strongPoints: JSON.stringify(evaluation.strongPoints),
          improvements: JSON.stringify(evaluation.improvements),
          rewriteSuggestion: evaluation.rewriteSuggestion || null,
          evaluatedAt: new Date()
        },
        include: {
          theme: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      logger.info(`Essay ${essayId} evaluated. Score: ${evaluation.totalScore}/1000`)
      return updatedEssay
    } catch (error: any) {
      const errorInfo = serializeError(error)
      logger.error('Error evaluating essay:', errorInfo)
      if (!error.message) {
        error.message = 'Erro ao avaliar redação com IA'
      }
      
      throw error
    }
  }

  private static evaluateLocally(
    content: string,
    themeTitle: string
  ): {
    totalScore: number
    scores: {
      c1: number
      c2: number
      c3: number
      c4: number
      c5: number
    }
    feedbacks: {
      c1: string
      c2: string
      c3: string
      c4: string
      c5: string
    }
    strongPoints: string[]
    improvements: string[]
    rewriteSuggestion?: string
  } {
    const text = content.trim()
    const wordCount = text.split(/\s+/).filter(Boolean).length
    const lower = text.toLowerCase()

    const hasIntroductionMarkers = /(introdu[cç][aã]o|inicialmente|primeiramente|ao abordar)/.test(lower)
    const hasConclusionMarkers = /(conclus[aã]o|por fim|em suma|portanto|assim|dessa forma)/.test(lower)
    const hasInterventionMarkers = /(proposta de interven[cç][aã]o|medida|pol[ií]tica p[uú]blica|governo|sociedade|fam[ií]lia|escola)/.test(lower)

    const paragraphCount = text.split(/\n{2,}/).filter((p) => p.trim().length > 0).length

    const lengthFactor = Math.max(0, Math.min(1, (wordCount - 150) / 350))
    const paragraphFactor = Math.max(0, Math.min(1, (paragraphCount - 2) / 3))

    let c1 = 120 + Math.round(80 * lengthFactor)
    let c2 = 120 + Math.round(80 * lengthFactor)
    let c3 = 120 + Math.round(80 * paragraphFactor)
    let c4 = 120 + Math.round(80 * paragraphFactor)
    let c5 = 80

    if (hasIntroductionMarkers) {
      c2 += 20
      c4 += 20
    }

    if (hasConclusionMarkers) {
      c3 += 20
      c4 += 20
    }

    if (hasInterventionMarkers) {
      c5 += 80
    }

    c1 = Math.max(40, Math.min(200, c1))
    c2 = Math.max(40, Math.min(200, c2))
    c3 = Math.max(40, Math.min(200, c3))
    c4 = Math.max(40, Math.min(200, c4))
    c5 = Math.max(40, Math.min(200, c5))

    const totalScore = c1 + c2 + c3 + c4 + c5

    const feedbacks = {
      c1: 'Avaliação automática: o texto apresenta domínio geral da norma padrão compatível com o esperado em redações do ENEM. Pequenos ajustes gramaticais e de pontuação podem elevar ainda mais a nota.',
      c2: `Avaliação automática: o texto se mantém relacionado ao tema "${themeTitle}" e demonstra compreensão global da proposta. Procure reforçar a tese de forma explícita na introdução e retomá-la na conclusão.`,
      c3: 'Avaliação automática: há tentativa de argumentação ao longo do texto. Para melhorar, aprofunde os argumentos com exemplos concretos, dados ou referências a conhecimentos de atualidades, história ou sociologia.',
      c4: 'Avaliação automática: o texto mostra certa organização entre os parágrafos. Use mais conectivos (como "além disso", "por conseguinte", "dessa forma") para tornar a progressão das ideias mais clara e coesa.',
      c5: 'Avaliação automática: há elementos de proposta de intervenção, mas eles podem ser mais detalhados. Indique agentes (quem), ações (o que será feito), meios (como) e finalidade (para quê), sempre respeitando os direitos humanos.'
    }

    const strongPoints: string[] = []
    const improvements: string[] = []

    if (wordCount >= 200) {
      strongPoints.push('Boa extensão de texto, o que permite desenvolver melhor os argumentos.')
    } else {
      improvements.push('Amplie um pouco mais a redação para desenvolver melhor as ideias e argumentos.')
    }

    if (paragraphCount >= 4) {
      strongPoints.push('Texto organizado em vários parágrafos, favorecendo a estrutura dissertativo-argumentativa.')
    } else {
      improvements.push('Organize o texto em pelo menos quatro parágrafos: introdução, dois de desenvolvimento e conclusão.')
    }

    if (hasConclusionMarkers) {
      strongPoints.push('Presença de conclusão, o que contribui para o fechamento do raciocínio.')
    } else {
      improvements.push('Inclua um parágrafo final de conclusão que retome a tese e a proposta de intervenção.')
    }

    if (hasInterventionMarkers) {
      strongPoints.push('Há elementos de proposta de intervenção relacionados ao problema discutido.')
    } else {
      improvements.push('Apresente uma proposta de intervenção detalhada (quem faz, o que faz, como faz e com qual objetivo).')
    }

    const rewriteSuggestion =
      'Reescreva a conclusão apresentando uma proposta de intervenção completa: indique um agente (por exemplo, governo, escola, mídia), uma ação concreta, o meio para realizá-la e o objetivo social a ser alcançado, mantendo o respeito aos direitos humanos.'

    return {
      totalScore,
      scores: {
        c1,
        c2,
        c3,
        c4,
        c5
      },
      feedbacks,
      strongPoints,
      improvements,
      rewriteSuggestion
    }
  }

  static async getEssayById(essayId: string, userId: string) {
    try {
      const essay = await prisma.essay.findFirst({
        where: {
          id: essayId,
          userId
        },
        include: {
          theme: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      if (!essay) {
        throw new Error('Redação não encontrada')
      }

      return essay
    } catch (error) {
      logger.error('Error getting essay by ID:', error)
      throw error
    }
  }

  /**
   * Lista redações de um usuário com filtros
   */
  static async listEssays(
    userId: string,
    filters?: {
      themeId?: string
      isEvaluated?: boolean
      limit?: number
      offset?: number
      orderBy?: 'createdAt' | 'totalScore'
      orderDirection?: 'asc' | 'desc'
    }
  ) {
    try {
      const where: any = {
        userId
      }

      if (filters?.themeId) {
        where.themeId = filters.themeId
      }

      if (filters?.isEvaluated !== undefined) {
        where.isEvaluated = filters.isEvaluated
      }

      const orderBy: any = {}
      if (filters?.orderBy) {
        orderBy[filters.orderBy] = filters.orderDirection || 'desc'
      } else {
        orderBy.createdAt = 'desc'
      }

      const [essays, total] = await Promise.all([
        prisma.essay.findMany({
          where,
          include: {
            theme: true
          },
          orderBy,
          take: filters?.limit || 50,
          skip: filters?.offset || 0
        }),
        prisma.essay.count({ where })
      ])

      return {
        essays,
        total,
        limit: filters?.limit || 50,
        offset: filters?.offset || 0
      }
    } catch (error) {
      logger.error('Error listing essays:', error)
      throw error
    }
  }

  /**
   * Deleta uma redação
   */
  static async deleteEssay(essayId: string, userId: string) {
    try {
      const essay = await prisma.essay.findFirst({
        where: {
          id: essayId,
          userId
        }
      })

      if (!essay) {
        throw new Error('Redação não encontrada ou você não tem permissão para deletá-la')
      }

      await prisma.essay.delete({
        where: {
          id: essayId
        }
      })

      logger.info(`Essay deleted: ${essayId}`)
      return { success: true }
    } catch (error) {
      logger.error('Error deleting essay:', error)
      throw error
    }
  }

  /**
   * Busca estatísticas de redações do usuário
   */
  static async getStatistics(userId: string) {
    try {
      const [
        totalEssays,
        evaluatedEssays,
        averageScore,
        scoresByCompetence,
        recentEssays
      ] = await Promise.all([
        prisma.essay.count({
          where: { userId }
        }),
        prisma.essay.count({
          where: {
            userId,
            isEvaluated: true
          }
        }),
        prisma.essay.aggregate({
          where: {
            userId,
            isEvaluated: true,
            totalScore: { not: null }
          },
          _avg: {
            totalScore: true
          }
        }),
        prisma.essay.aggregate({
          where: {
            userId,
            isEvaluated: true
          },
          _avg: {
            scoreC1: true,
            scoreC2: true,
            scoreC3: true,
            scoreC4: true,
            scoreC5: true
          }
        }),
        prisma.essay.findMany({
          where: {
            userId,
            isEvaluated: true
          },
          orderBy: {
            evaluatedAt: 'desc'
          },
          take: 10,
          select: {
            totalScore: true,
            evaluatedAt: true
          }
        })
      ])

      return {
        totalEssays,
        evaluatedEssays,
        averageScore: averageScore._avg.totalScore ? Math.round(averageScore._avg.totalScore) : 0,
        averageByCompetence: {
          c1: scoresByCompetence._avg.scoreC1 ? Math.round(scoresByCompetence._avg.scoreC1) : 0,
          c2: scoresByCompetence._avg.scoreC2 ? Math.round(scoresByCompetence._avg.scoreC2) : 0,
          c3: scoresByCompetence._avg.scoreC3 ? Math.round(scoresByCompetence._avg.scoreC3) : 0,
          c4: scoresByCompetence._avg.scoreC4 ? Math.round(scoresByCompetence._avg.scoreC4) : 0,
          c5: scoresByCompetence._avg.scoreC5 ? Math.round(scoresByCompetence._avg.scoreC5) : 0
        },
        recentScores: recentEssays
          .filter(e => e.totalScore !== null)
          .map(e => ({
            score: e.totalScore!,
            date: e.evaluatedAt!
          }))
      }
    } catch (error) {
      logger.error('Error getting statistics:', error)
      throw error
    }
  }
}

