'use client'

import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Clock, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function NovaRedacao() {
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [tema, setTema] = useState('')
  const [cronometro, setCronometro] = useState(false)
  const [tempo, setTempo] = useState(0)

  const palavras = conteudo.trim().split(/\s+/).filter(Boolean).length
  const caracteres = conteudo.length

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

  const temas = [
    'Desafios da educação no Brasil',
    'Sustentabilidade e meio ambiente',
    'Inclusão social e diversidade',
    'Tecnologia e sociedade',
    'Saúde pública',
  ]

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
            <div className="flex items-center gap-4">
              <select
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                className="px-4 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
              >
                <option value="">Selecione o tema</option>
                {temas.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              
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
            
            <Button onClick={() => window.location.href = '/redacoes/1/resultado'}>
              Avaliar agora
            </Button>
          </div>
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

