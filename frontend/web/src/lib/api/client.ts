/**
 * Cliente HTTP base para comunicação com a API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export interface ApiError {
  message: string
  status?: number
  errors?: Record<string, string[]>
}

export class ApiClient {
  private baseURL: string
  private accessToken: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    // Recuperar token do localStorage ao inicializar
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken')
    }
  }

  setAccessToken(token: string | null) {
    this.accessToken = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token)
      } else {
        localStorage.removeItem('accessToken')
      }
    }
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Adicionar token de autenticação se existir
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Se não conseguir fazer a requisição (erro de rede)
      if (!response) {
        throw {
          message: `Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${this.baseURL}`,
          status: 0,
        } as ApiError
      }

      let data: any = {}
      try {
        const text = await response.text()
        if (text) {
          data = JSON.parse(text)
        }
      } catch (parseError) {
        // Se não conseguir fazer parse, usar objeto vazio
        console.warn('Erro ao fazer parse da resposta:', parseError)
      }

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || `Erro na requisição (${response.status})`,
          status: response.status,
          errors: data.errors,
        }
        throw error
      }

      return data
    } catch (error: any) {
      // Erro de rede (servidor não disponível)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw {
          message: `Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${this.baseURL}`,
          status: 0,
        } as ApiError
      }

      // Erro já formatado
      if (error.message && error.status !== undefined) {
        throw error as ApiError
      }

      // Erro genérico
      throw {
        message: error.message || 'Erro de conexão com o servidor',
        status: 0,
      } as ApiError
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Instância singleton do cliente
export const apiClient = new ApiClient()
