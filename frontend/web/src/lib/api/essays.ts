/**
 * Serviço de redações
 */

import { apiClient } from './client'

export interface Essay {
  id: string
  userId: string
  themeId: string
  title?: string
  content: string
  wordCount: number
  charCount: number
  isEvaluated: boolean
  totalScore?: number
  scoreC1?: number
  scoreC2?: number
  scoreC3?: number
  scoreC4?: number
  scoreC5?: number
  feedbackC1?: string
  feedbackC2?: string
  feedbackC3?: string
  feedbackC4?: string
  feedbackC5?: string
  strongPoints?: string
  improvements?: string
  rewriteSuggestion?: string
  evaluatedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateEssayRequest {
  themeId: string
  title?: string
  content: string
}

export interface UpdateEssayRequest {
  title?: string
  content?: string
}

export interface EssaysResponse {
  success: true
  data: Essay[]
}

export interface EssayResponse {
  success: true
  data: Essay
}

export interface EvaluateResponse {
  success: true
  message: string
  data: Essay
}

export const essayService = {
  /**
   * Criar nova redação
   */
  async create(data: CreateEssayRequest): Promise<Essay> {
    const response = await apiClient.post<EssayResponse>('/api/essays', data)
    return response.data
  },

  /**
   * Listar redações do usuário
   */
  async getAll(params?: {
    themeId?: string
    isEvaluated?: boolean
    limit?: number
    offset?: number
  }): Promise<Essay[]> {
    const queryParams = new URLSearchParams()
    if (params?.themeId) queryParams.set('themeId', params.themeId)
    if (params?.isEvaluated !== undefined) queryParams.set('isEvaluated', String(params.isEvaluated))
    if (params?.limit) queryParams.set('limit', String(params.limit))
    if (params?.offset) queryParams.set('offset', String(params.offset))

    const query = queryParams.toString()
    const endpoint = `/api/essays${query ? `?${query}` : ''}`

    const response = await apiClient.get<EssaysResponse>(endpoint)
    return response.data
  },

  /**
   * Obter redação por ID
   */
  async getById(id: string): Promise<Essay> {
    const response = await apiClient.get<EssayResponse>(`/api/essays/${id}`)
    return response.data
  },

  /**
   * Atualizar redação
   */
  async update(id: string, data: UpdateEssayRequest): Promise<Essay> {
    const response = await apiClient.put<EssayResponse>(`/api/essays/${id}`, data)
    return response.data
  },

  /**
   * Avaliar redação com IA
   */
  async evaluate(id: string): Promise<Essay> {
    const response = await apiClient.post<EvaluateResponse>(
      `/api/essays/${id}/evaluate`,
      {}
    )
    return response.data
  },

  /**
   * Deletar redação
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/essays/${id}`)
  },

  /**
   * Obter estatísticas das redações
   */
  async getStatistics(): Promise<{
    totalEssays: number
    evaluatedEssays: number
    averageScore: number
    averageByCompetence: {
      c1: number
      c2: number
      c3: number
      c4: number
      c5: number
    }
    recentScores: Array<{
      score: number
      date: string
    }>
  }> {
    const response = await apiClient.get<{
      success: true
      data: {
        totalEssays: number
        evaluatedEssays: number
        averageScore: number
        averageByCompetence: {
          c1: number
          c2: number
          c3: number
          c4: number
          c5: number
        }
        recentScores: Array<{
          score: number
          date: string
        }>
      }
    }>('/api/essays/statistics')
    return response.data
  },
}

