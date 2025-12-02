'use client'

import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const { login, isAuthenticated, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [loading, isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Erro ao fazer login:', err)
      let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.'
      
      // Erro de conexão (backend não está rodando)
      if (err.message && err.message.includes('conectar')) {
        errorMessage = err.message
      } else if (err.message && err.message.includes('fetch')) {
        errorMessage = `Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}`
      } else if (err.message) {
        errorMessage = err.message
      } else if (err.status === 0) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.'
      }
      
      setError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 transition-colors duration-300">
      <Header isInternal={false} />
      <ThemeToggle />
      
      <div className="max-w-md mx-auto px-6 py-12">
        <Card className="p-8">
          <Heading level={2} className="text-center mb-8">
            Entrar
          </Heading>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="small text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block small font-medium text-secondary dark:text-[#A9A9A9] mb-2 transition-colors duration-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
                placeholder="seu@email.com"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block small font-medium text-secondary dark:text-[#A9A9A9] mb-2 transition-colors duration-300">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
                placeholder="••••••••"
                disabled={submitting}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
          <p className="text-center small text-secondary dark:text-[#A9A9A9] mt-6 transition-colors duration-300">
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="text-accent hover:underline">
              Criar conta
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
