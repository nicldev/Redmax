'use client'

import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import { Download, Edit, Loader2, ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { essayService, Essay } from '@/lib/api/essays'
import { themeService, Theme } from '@/lib/api/themes'
import Link from 'next/link'

export default function ResultadoAvaliacao() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const id = params?.id as string
  const [essay, setEssay] = useState<Essay | null>(null)
  const [theme, setTheme] = useState<Theme | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Carregar dados da redação
  useEffect(() => {
    if (isAuthenticated && id) {
      loadEssay()
    }
  }, [isAuthenticated, id])

  const loadEssay = async () => {
    try {
      setLoading(true)
      setError(null)

      const essayData = await essayService.getById(id)
      setEssay(essayData)

      // Carregar tema
      try {
        const themes = await themeService.getAll()
        const foundTheme = themes.find(t => t.id === essayData.themeId)
        if (foundTheme) {
          setTheme(foundTheme)
        }
      } catch (err) {
        console.error('Erro ao carregar tema:', err)
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar redação')
      console.error('Erro ao carregar redação:', err)
    } finally {
      setLoading(false)
    }
  }

  // Se não estiver avaliada, redirecionar para editar
  useEffect(() => {
    if (essay && !essay.isEvaluated) {
      router.push(`/redacoes/${essay.id}/editar`)
    }
  }, [essay, router])

  const getNotaColor = (nota: number) => {
    if (nota >= 180) return 'text-green-600 dark:text-green-400'
    if (nota >= 140) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getChipText = (nota: number) => {
    if (nota >= 900) return { text: 'Excelente', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' }
    if (nota >= 800) return { text: 'Muito Bom', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' }
    if (nota >= 700) return { text: 'Bom', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' }
    if (nota >= 600) return { text: 'Regular', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' }
    return { text: 'Precisa melhorar', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' }
  }

  const parseJsonField = (field: string | null | undefined): string[] => {
    if (!field) return []
    try {
      if (typeof field === 'string') {
        const parsed = JSON.parse(field)
        return Array.isArray(parsed) ? parsed : [parsed]
      }
      return Array.isArray(field) ? field : []
    } catch {
      // Se não for JSON, tratar como string separada por vírgula ou quebra de linha
      return field.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error || !essay) {
    return (
      <div className="min-h-screen pt-20 transition-colors duration-300">
        <Header isInternal={true} />
        <ThemeToggle />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card className="p-8 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error || 'Redação não encontrada'}
            </p>
            <Link href="/redacoes">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Voltar para redações
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  const competencias = [
    { 
      nome: 'C1 - Domínio da escrita', 
      nota: essay.scoreC1 || 0, 
      max: 200, 
      feedback: essay.feedbackC1 || 'Aguardando avaliação' 
    },
    { 
      nome: 'C2 - Compreensão', 
      nota: essay.scoreC2 || 0, 
      max: 200, 
      feedback: essay.feedbackC2 || 'Aguardando avaliação' 
    },
    { 
      nome: 'C3 - Argumentação', 
      nota: essay.scoreC3 || 0, 
      max: 200, 
      feedback: essay.feedbackC3 || 'Aguardando avaliação' 
    },
    { 
      nome: 'C4 - Coesão', 
      nota: essay.scoreC4 || 0, 
      max: 200, 
      feedback: essay.feedbackC4 || 'Aguardando avaliação' 
    },
    { 
      nome: 'C5 - Proposta', 
      nota: essay.scoreC5 || 0, 
      max: 200, 
      feedback: essay.feedbackC5 || 'Aguardando avaliação' 
    },
  ]

  const notaFinal = essay.totalScore || 0
  const chip = getChipText(notaFinal)
  const pontosFortes = parseJsonField(essay.strongPoints)
  const melhorias = parseJsonField(essay.improvements)

  return (
    <div className="min-h-screen pt-20 transition-colors duration-300">
      <Header isInternal={true} />
      <ThemeToggle />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Botão voltar */}
        <Link href="/redacoes">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Voltar para redações
          </Button>
        </Link>

        {/* Tema */}
        {theme && (
          <Card className="mb-6">
            <p className="small text-secondary dark:text-[#A9A9A9] mb-2">Tema:</p>
            <p className="font-semibold">{theme.title}</p>
            {theme.description && (
              <p className="small text-secondary dark:text-[#A9A9A9] mt-2">{theme.description}</p>
            )}
          </Card>
        )}

        {/* Topo - Nota final */}
        <Card className="text-center mb-8">
          <div className="mb-4">
            <div className="number-mono text-6xl font-bold text-primary dark:text-[#F5F5F5] mb-2 transition-colors duration-300">
              {notaFinal}/1000
            </div>
            <span className={`inline-block px-3 py-1 rounded-full small font-medium ${chip.color}`}>
              {chip.text}
            </span>
          </div>
        </Card>

        {/* Grid 5 cards - Competências */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {competencias.map((comp, index) => (
            <Card key={index}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-sans font-semibold small">{comp.nome}</h3>
                <span className={`number-mono font-bold ${getNotaColor(comp.nota)} transition-colors duration-300`}>
                  {comp.nota}/{comp.max}
                </span>
              </div>
              <div className="w-full bg-border dark:bg-[#2A2A2A] rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full ${
                    comp.nota >= 180 ? 'bg-green-500' :
                    comp.nota >= 140 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(comp.nota / comp.max) * 100}%` }}
                />
              </div>
              <p className="small text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                {comp.feedback}
              </p>
            </Card>
          ))}
        </div>

        {/* Pontos fortes */}
        {pontosFortes.length > 0 && (
          <Card className="mb-6">
            <Heading level={3} className="mb-4">Pontos fortes</Heading>
            <ul className="space-y-2">
              {pontosFortes.map((ponto, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                    {ponto}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* O que melhorar */}
        {melhorias.length > 0 && (
          <Card className="mb-6">
            <Heading level={3} className="mb-4">O que melhorar</Heading>
            <ul className="space-y-2">
              {melhorias.map((melhoria, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-accent mt-1">→</span>
                  <span className="text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                    {melhoria}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Sugestão de reescrita */}
        {essay.rewriteSuggestion && (
          <Card className="mb-6">
            <Heading level={3} className="mb-4">Sugestão de reescrita</Heading>
            <div className="space-y-4">
              <div>
                <p className="small text-secondary dark:text-[#A9A9A9] mb-2 transition-colors duration-300">
                  Versão sugerida:
                </p>
                <div className="bg-accent/5 dark:bg-accent/10 p-4 rounded-md border border-accent/20 dark:border-accent/30 transition-colors duration-300">
                  <p className="small font-sans whitespace-pre-wrap">
                    {essay.rewriteSuggestion}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Botões de ação */}
        <div className="flex gap-4 flex-wrap">
          <Link href="/redacoes">
            <Button>
              Voltar para redações
            </Button>
          </Link>
          <Link href="/redacoes/nova">
            <Button variant="outline">
              <Edit className="w-4 h-4 inline mr-2" />
              Nova redação
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
