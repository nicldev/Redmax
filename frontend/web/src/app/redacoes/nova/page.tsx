'use client'

import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Clock, FileText, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { themeService, Theme } from '@/lib/api/themes'
import { essayService } from '@/lib/api/essays'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function NovaRedacao() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const [themes, setThemes] = useState<Theme[]>([])
  const [loadingTheme, setLoadingTheme] = useState(false)
  const [cronometro, setCronometro] = useState(false)
  const [tempo, setTempo] = useState(0)
  const [saving, setSaving] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const palavras = conteudo.trim().split(/\s+/).filter(Boolean).length
  const caracteres = conteudo.length

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Carregar tema aleatório ao montar
  useEffect(() => {
    loadRandomTheme()
  }, [])

  // Cronômetro
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (cronometro) {
      interval = setInterval(() => {
        setTempo((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [cronometro])

  const loadRandomTheme = async () => {
    try {
      setLoadingTheme(true)
      setError(null)
      const theme = await themeService.getRandom()
      setSelectedTheme(theme)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar tema')
      console.error('Erro ao carregar tema:', err)
    } finally {
      setLoadingTheme(false)
    }
  }

  const handleSave = async () => {
    if (!selectedTheme) {
      setError('Selecione um tema primeiro')
      return
    }

    if (!conteudo.trim()) {
      setError('Escreva sua redação antes de salvar')
      return
    }

    try {
      setSaving(true)
      setError(null)
      const essay = await essayService.create({
        themeId: selectedTheme.id,
        title: titulo || undefined,
        content: conteudo,
      })
      // Redirecionar para a página da redação
      router.push(`/redacoes/${essay.id}`)
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar redação')
      console.error('Erro ao salvar redação:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleEvaluate = async () => {
    if (!selectedTheme) {
      setError('Selecione um tema primeiro')
      return
    }

    if (!conteudo.trim()) {
      setError('Escreva sua redação antes de avaliar')
      return
    }

    try {
      setEvaluating(true)
      setError(null)

      // Primeiro, salvar a redação
      let essay = await essayService.create({
        themeId: selectedTheme.id,
        title: titulo || undefined,
        content: conteudo,
      })

      // Depois, avaliar
      essay = await essayService.evaluate(essay.id)

      // Redirecionar para a página de resultado
      router.push(`/redacoes/${essay.id}/resultado`)
    } catch (err: any) {
      console.error('Erro completo ao avaliar redação:', err)
      console.error('Erro status:', err.status)
      console.error('Erro response:', err.response?.data)
      
      let errorMessage = 'Erro ao avaliar redação com IA. Tente novamente.'
      
      // Erros específicos do backend
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        if (err.message.includes('GEMINI_API_KEY') || err.message.includes('IA não configurado') || err.message.includes('não configurado')) {
          errorMessage = 'Serviço de IA não configurado. Verifique se a chave do Gemini está configurada no backend.'
        } else if (err.message.includes('Timeout')) {
          errorMessage = 'A avaliação demorou muito. Tente novamente com uma redação menor.'
        } else if (err.message.includes('precisa ter pelo menos')) {
          errorMessage = err.message
        } else if (err.message.includes('não encontrada')) {
          errorMessage = err.message
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setEvaluating(false)
    }
  }

  if (authLoading) {
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
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Título editável */}
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título da redação..."
          className="w-full section-title-serif text-3xl mb-8 bg-transparent border-none outline-none placeholder:text-secondary/50 dark:placeholder:text-[#A9A9A9]/50 text-primary dark:text-[#F5F5F5] transition-colors duration-300"
        />

        {/* Topo do editor */}
        <Card className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-1">
              {loadingTheme ? (
                <div className="flex items-center gap-2 px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="small">Carregando tema...</span>
                </div>
              ) : selectedTheme ? (
                <div className="flex items-center gap-2 px-4 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020]">
                  <span className="small text-primary dark:text-[#F5F5F5]">
                    {selectedTheme.title}
                  </span>
                  <button
                    onClick={loadRandomTheme}
                    className="small text-accent hover:underline"
                    title="Trocar tema"
                  >
                    🔄
                  </button>
                </div>
              ) : (
                <button
                  onClick={loadRandomTheme}
                  className="px-4 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors duration-300"
                >
                  Buscar tema aleatório
                </button>
              )}
              
              <button
                onClick={() => setCronometro(!cronometro)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                  cronometro
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white dark:bg-[#202020] text-secondary dark:text-[#A9A9A9] border-border dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors duration-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                Cronômetro
              </button>
              
              {cronometro && (
                <span className="number-mono text-lg">
                  {Math.floor(tempo / 60)}:{(tempo % 60).toString().padStart(2, '0')}
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="secondary"
                onClick={handleSave}
                disabled={saving || evaluating || !conteudo.trim()}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar rascunho'
                )}
              </Button>
              <Button 
                onClick={handleEvaluate}
                disabled={saving || evaluating || !conteudo.trim()}
              >
                {evaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                    Avaliando...
                  </>
                ) : (
                  'Avaliar agora'
                )}
              </Button>
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="small text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Descrição do tema */}
          {selectedTheme?.description && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-[#2A2A2A] rounded-md">
              <p className="small text-secondary dark:text-[#A9A9A9]">
                {selectedTheme.description}
              </p>
            </div>
          )}
        </Card>

        <div className="flex gap-6">
          {/* Editor principal */}
          <div className="flex-1">
            <Card>
              <textarea
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                placeholder="Comece a escrever sua redação aqui..."
                className="w-full min-h-[600px] p-6 text-base leading-relaxed resize-none border-none outline-none bg-transparent text-primary dark:text-[#F5F5F5] placeholder:text-secondary/30 dark:placeholder:text-[#A9A9A9]/30 transition-colors duration-300"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <div className="border-t border-border dark:border-[#2A2A2A] pt-4 mt-4 flex justify-between small text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                <span className="mono">{palavras} palavras</span>
                <span className="mono">{caracteres} caracteres</span>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-64 space-y-4">
            <Card>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Dicas rápidas
              </h3>
              <ul className="space-y-2 small text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                <li>• Introdução: apresente o tema</li>
                <li>• Desenvolvimento: argumente com dados</li>
                <li>• Conclusão: proponha soluções</li>
              </ul>
            </Card>

            <Card>
              <h3 className="font-semibold mb-3">Estrutura recomendada</h3>
              <div className="small text-secondary dark:text-[#A9A9A9] space-y-2 transition-colors duration-300">
                <p><strong>Introdução:</strong> 4-5 linhas</p>
                <p><strong>Desenvolvimento:</strong> 2 parágrafos, 5-7 linhas cada</p>
                <p><strong>Conclusão:</strong> 4-5 linhas</p>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold mb-3">Repertórios úteis</h3>
              <div className="small text-secondary dark:text-[#A9A9A9] space-y-2 transition-colors duration-300">
                <p>• Filósofos: Kant, Rousseau</p>
                <p>• Sociólogos: Bauman, Giddens</p>
                <p>• Dados: IBGE, ONU</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
