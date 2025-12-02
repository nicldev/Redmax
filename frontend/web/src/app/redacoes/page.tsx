'use client'

import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Plus, Filter, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { essayService, Essay } from '@/lib/api/essays'
import { themeService, Theme } from '@/lib/api/themes'

export default function Redacoes() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [essays, setEssays] = useState<Essay[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterTheme, setFilterTheme] = useState<string>('')
  const [filterEvaluated, setFilterEvaluated] = useState<string>('')

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Carregar redações e temas
  useEffect(() => {
    if (isAuthenticated) {
      loadEssays()
      loadThemes()
    }
  }, [isAuthenticated])

  // Recarregar quando filtros mudarem
  useEffect(() => {
    if (isAuthenticated) {
      loadEssays()
    }
  }, [filterTheme, filterEvaluated, isAuthenticated])

  const loadEssays = async () => {
    try {
      setLoading(true)
      setError(null)

      const params: any = {}
      if (filterTheme) params.themeId = filterTheme
      if (filterEvaluated) {
        params.isEvaluated = filterEvaluated === 'true'
      }

      const data = await essayService.getAll(params)
      setEssays(data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar redações')
      console.error('Erro ao carregar redações:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadThemes = async () => {
    try {
      const data = await themeService.getAll()
      setThemes(data)
    } catch (err) {
      console.error('Erro ao carregar temas:', err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const getThemeName = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId)
    return theme?.title || 'Tema desconhecido'
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 transition-colors duration-300">
      <Header isInternal={true} />
      <ThemeToggle />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <Heading level={2}>Suas redações</Heading>
          <Link href="/redacoes/nova">
            <Button>
              <Plus className="w-4 h-4 inline mr-2" />
              Nova Redação
            </Button>
          </Link>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-4 h-4 text-secondary dark:text-[#A9A9A9] transition-colors duration-300" />
            <select
              value={filterTheme}
              onChange={(e) => setFilterTheme(e.target.value)}
              className="px-3 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] small focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
            >
              <option value="">Todos os temas</option>
              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.title}
                </option>
              ))}
            </select>
            <select
              value={filterEvaluated}
              onChange={(e) => setFilterEvaluated(e.target.value)}
              className="px-3 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] small focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
            >
              <option value="">Todas as redações</option>
              <option value="true">Avaliadas</option>
              <option value="false">Não avaliadas</option>
            </select>
          </div>
        </Card>

        {/* Erro */}
        {error && (
          <Card className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="small text-red-600 dark:text-red-400">{error}</p>
          </Card>
        )}

        {/* Tabela */}
        <Card>
          {essays.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-secondary dark:text-[#A9A9A9] mb-4">
                Você ainda não tem redações cadastradas.
              </p>
              <Link href="/redacoes/nova">
                <Button>Criar primeira redação</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Título</th>
                    <th className="text-left py-3 px-4 small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Data</th>
                    <th className="text-left py-3 px-4 small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Tema</th>
                    <th className="text-left py-3 px-4 small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Nota</th>
                    <th className="text-left py-3 px-4 mono small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">C1</th>
                    <th className="text-left py-3 px-4 mono small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">C2</th>
                    <th className="text-left py-3 px-4 mono small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">C3</th>
                    <th className="text-left py-3 px-4 mono small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">C4</th>
                    <th className="text-left py-3 px-4 mono small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">C5</th>
                  </tr>
                </thead>
                <tbody>
                  {essays.map((essay) => (
                    <tr key={essay.id} className="border-b border-border dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors">
                      <td className="py-4 px-4">
                        {essay.isEvaluated ? (
                          <Link 
                            href={`/redacoes/${essay.id}/resultado`} 
                            className="text-primary dark:text-[#F5F5F5] hover:text-accent font-medium transition-colors duration-300"
                          >
                            {essay.title || 'Sem título'}
                          </Link>
                        ) : (
                          <span className="text-primary dark:text-[#F5F5F5]">
                            {essay.title || 'Sem título'}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 mono small text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                        {formatDate(essay.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-secondary dark:text-[#A9A9A9] small transition-colors duration-300">
                        {getThemeName(essay.themeId)}
                      </td>
                      <td className="py-4 px-4 number-mono font-semibold text-primary dark:text-[#F5F5F5] transition-colors duration-300">
                        {essay.isEvaluated && essay.totalScore ? (
                          `${essay.totalScore}/1000`
                        ) : (
                          <span className="text-secondary dark:text-[#A9A9A9]">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 mono small text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                        {essay.scoreC1 ?? '—'}
                      </td>
                      <td className="py-4 px-4 mono small text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                        {essay.scoreC2 ?? '—'}
                      </td>
                      <td className="py-4 px-4 mono small text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                        {essay.scoreC3 ?? '—'}
                      </td>
                      <td className="py-4 px-4 mono small text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                        {essay.scoreC4 ?? '—'}
                      </td>
                      <td className="py-4 px-4 mono small text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                        {essay.scoreC5 ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
