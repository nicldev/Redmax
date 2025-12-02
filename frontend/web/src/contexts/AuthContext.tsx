'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService, User } from '@/lib/api/auth'
import { apiClient } from '@/lib/api/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    name: string
    email: string
    password: string
    confirmPassword: string
    school?: string
    grade?: string
  }) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Carregar usuário ao inicializar
  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const response = await authService.getProfile()
        setUser(response.data.user)
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error)
      // Se o token for inválido, limpar
      authService.logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    setUser(response.data.user)
  }

  const register = async (data: {
    name: string
    email: string
    password: string
    confirmPassword: string
    school?: string
    grade?: string
  }) => {
    await authService.register(data)
    // Após registrar, fazer login
    await login(data.email, data.password)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const refreshUser = async () => {
    await loadUser()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

