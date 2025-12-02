'use client'

import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { essayService } from '@/lib/api/essays'
import { themeService, Theme } from '@/lib/api/themes'
import { Essay } from '@/lib/api/essays'

export default function Dashboard() {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statistics, setStatistics] = useState<{
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
    recentScores: Array<{ score: number; date: string }>
  } | null>(null)
  const [recentEssays, setRecentEssays] = useState<Essay[]>([])
  const [themes, setThemes] = useState<Theme[]>([])

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Carregar dados
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData()
    }
  }, [isAuthenticated])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // Não limpar erro aqui - manter mensagem anterior se houver

      // Carregar estatísticas e redações em paralelo
      const [stats, essays, themesData] = await Promise.all([
        essayService.getStatistics(),
        essayService.getAll({ limit: 5 }),
        themeService.getAll(),
      ])

      setStatistics(stats)
      setRecentEssays(essays.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))
      setThemes(themesData)
      setError(null) // Limpar erro apenas se carregar com sucesso
    } catch (err: any) {
      // Verificar se é erro de rate limit
      const errorMessage = err.message || 'Erro ao carregar dados do dashboard'
      const isRateLimitError = errorMessage.includes('Muitas requisições') || 
                               errorMessage.includes('muitas requisições') ||
                               errorMessage.includes('rate limit')
      
      if (isRateLimitError) {
        // Para rate limit, apenas mostrar mensagem, mas manter dados existentes
        setError('Muitas requisições. Aguarde alguns minutos e recarregue a página. Seus dados não foram perdidos.')
      } else {
        // Para outros erros, mostrar mensagem mas também manter dados existentes
        setError(errorMessage)
      }
      
      console.error('Erro ao carregar dashboard:', err)
      // NÃO limpar dados existentes - apenas mostrar erro
    } finally {
      setLoading(false)
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

  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  // Preparar dados das competências
  const competencias = statistics ? [
    { nome: 'C1 - Domínio da escrita', nota: statistics.averageByCompetence.c1, max: 200 },
    { nome: 'C2 - Compreensão', nota: statistics.averageByCompetence.c2, max: 200 },
    { nome: 'C3 - Argumentação', nota: statistics.averageByCompetence.c3, max: 200 },
    { nome: 'C4 - Coesão', nota: statistics.averageByCompetence.c4, max: 200 },
    { nome: 'C5 - Proposta', nota: statistics.averageByCompetence.c5, max: 200 },
  ] : []


  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen pt-20 transition-colors duration-300">
      <Header isInternal={true} />
      <ThemeToggle />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Interno */}
        <div className="mb-12">
          <h1 className="section-title-serif text-3xl mb-2">
            Olá, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
            Pronto para treinar hoje?
          </p>
        </div>

        {error && (
          <Card className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="small text-red-600 dark:text-red-400">{error}</p>
          </Card>
        )}

        {/* Cards principais */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Card 1 - Média atual */}
          <Card>
            <h3 className="small text-secondary dark:text-[#A9A9A9] mb-4 transition-colors duration-300">
              Média atual
            </h3>
            <div className="number-mono text-4xl font-bold text-primary dark:text-[#F5F5F5] mb-6 transition-colors duration-300">
              {statistics?.averageScore || 0}/1000
            </div>
            {statistics && statistics.evaluatedEssays > 0 ? (
              <div className="space-y-3">
                {competencias.map((comp, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="small text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                        {comp.nome}
                      </span>
                      <span className="number-mono text-primary dark:text-[#F5F5F5] font-medium transition-colors duration-300">
                        {comp.nota}/{comp.max}
                      </span>
                    </div>
                    <div className="w-full bg-border dark:bg-[#2A2A2A] rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full"
                        style={{ width: `${(comp.nota / comp.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="small text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                Complete e avalie suas primeiras redações para ver suas estatísticas.
              </p>
            )}
          </Card>

          {/* Card 2 - Estatísticas rápidas */}
          <Card>
            <h3 className="text-sm text-secondary dark:text-[#A9A9A9] mb-4 transition-colors duration-300">
              Estatísticas
            </h3>
            <div className="space-y-4">
              <div>
                <p className="small text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                  Total de redações
                </p>
                <p className="number-mono text-2xl font-bold text-primary dark:text-[#F5F5F5] transition-colors duration-300">
                  {statistics?.totalEssays || 0}
                </p>
              </div>
              <div>
                <p className="small text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                  Redações avaliadas
                </p>
                <p className="number-mono text-2xl font-bold text-primary dark:text-[#F5F5F5] transition-colors duration-300">
                  {statistics?.evaluatedEssays || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Últimas redações */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3}>Suas últimas redações</Heading>
            <Link href="/redacoes/nova">
              <Button>
                <Plus className="w-4 h-4 inline mr-2" />
                Nova Redação
              </Button>
            </Link>
          </div>
          <Card>
            {recentEssays.length === 0 ? (
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
                      <th className="text-left py-3 px-4 small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                        Título
                      </th>
                      <th className="text-left py-3 px-4 small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                        Data
                      </th>
                      <th className="text-left py-3 px-4 small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                        Tema
                      </th>
                      <th className="text-left py-3 px-4 small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                        Nota
                      </th>
                      <th className="text-left py-3 px-4 small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEssays.map((essay) => (
                      <tr
                        key={essay.id}
                        className="border-b border-border dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors"
                      >
                        <td className="py-3 px-4">
                          {essay.isEvaluated ? (
                            <Link
                              href={`/redacoes/${essay.id}/resultado`}
                              className="text-primary dark:text-[#F5F5F5] hover:text-accent transition-colors duration-300"
                            >
                              {essay.title || 'Sem título'}
                            </Link>
                          ) : (
                            <span className="text-primary dark:text-[#F5F5F5]">
                              {essay.title || 'Sem título'}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-secondary dark:text-[#A9A9A9] text-sm transition-colors duration-300">
                          {formatDate(essay.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-secondary dark:text-[#A9A9A9] text-sm transition-colors duration-300">
                          {getThemeName(essay.themeId)}
                        </td>
                        <td className="py-3 px-4 font-semibold text-primary dark:text-[#F5F5F5] transition-colors duration-300">
                          {essay.isEvaluated && essay.totalScore ? (
                            `${essay.totalScore}/1000`
                          ) : (
                            <span className="text-secondary dark:text-[#A9A9A9]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {essay.isEvaluated ? (
                            <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                              Avaliada
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full">
                              Rascunho
                            </span>
                          )}
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
    </div>
  )
}
