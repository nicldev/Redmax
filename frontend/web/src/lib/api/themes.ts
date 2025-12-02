/**
 * Serviço de temas de redação
 */

import { apiClient } from './client'

export interface Theme {
  id: string
  title: string
  description?: string
  category: string
  year?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ThemesResponse {
  success: true
  data: Theme[]
}

export interface ThemeResponse {
  success: true
  data: Theme
}

export const themeService = {
  /**
   * Buscar tema aleatório
   */
  async getRandom(): Promise<Theme> {
    const response = await apiClient.get<ThemeResponse>('/api/themes/random')
    return response.data
  },

  /**
   * Listar todos os temas
   */
  async getAll(): Promise<Theme[]> {
    const response = await apiClient.get<ThemesResponse>('/api/themes')
    return response.data
  },
}

