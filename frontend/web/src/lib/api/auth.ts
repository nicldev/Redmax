/**
 * Serviço de autenticação
 */

import { apiClient } from './client'

export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  school?: string
  grade?: string
}

export interface LoginResponse {
  success: true
  data: {
    user: User
    accessToken: string
    refreshToken: string
  }
}

export interface RegisterResponse {
  success: true
  message: string
  data: {
    user: User
  }
}

export interface AuthError {
  message: string
  errors?: Record<string, string[]>
}

export const authService = {
  /**
   * Registrar novo usuário
   */
  async register(data: {
    name: string
    email: string
    password: string
    confirmPassword: string
    school?: string
    grade?: string
  }): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/api/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      school: data.school,
      grade: data.grade,
    })
    return response
  },

  /**
   * Fazer login
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', {
      email,
      password,
    })

    // Salvar token
    if (response.success && response.data.accessToken) {
      apiClient.setAccessToken(response.data.accessToken)
    }

    return response
  },

  /**
   * Obter perfil do usuário logado
   */
  async getProfile(): Promise<{ success: true; data: { user: User } }> {
    return apiClient.get('/api/auth/me')
  },

  /**
   * Fazer logout
   */
  logout() {
    apiClient.setAccessToken(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    }
  },

  /**
   * Verificar se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!apiClient.getAccessToken()
  },

  /**
   * Atualizar perfil do usuário
   */
  async updateProfile(data: {
    name?: string
    school?: string
    grade?: string
  }): Promise<{ success: true; message: string; data: { user: User } }> {
    return apiClient.put('/api/user/profile', data)
  },
}

