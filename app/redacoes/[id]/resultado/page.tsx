'use client'

import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Download, Share2, Edit } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function ResultadoAvaliacao() {
  const params = useParams()
  const id = params?.id as string
  const notaFinal = 740
  const competencias = [
    { nome: 'C1 - Domínio da escrita', nota: 150, max: 200, feedback: 'Bom domínio da norma padrão. Alguns desvios pontuais.' },
    { nome: 'C2 - Compreensão', nota: 180, max: 200, feedback: 'Excelente compreensão do tema e dos textos motivadores.' },
    { nome: 'C3 - Argumentação', nota: 160, max: 200, feedback: 'Argumentos válidos, mas podem ser mais desenvolvidos.' },
    { nome: 'C4 - Coesão', nota: 140, max: 200, feedback: 'Boa articulação, mas alguns conectivos podem ser melhorados.' },
    { nome: 'C5 - Proposta', nota: 110, max: 200, feedback: 'Proposta presente, mas precisa de mais detalhamento.' },
  ]

  const pontosFortes = [
    'Excelente compreensão do tema',
    'Boa estrutura textual',
    'Uso adequado de conectivos na maior parte do texto',
  ]

  const melhorias = [
    'Desenvolver mais os argumentos com dados concretos',
    'Detalhar melhor a proposta de intervenção',
    'Revisar alguns desvios gramaticais',
  ]

  const getNotaColor = (nota: number) => {
    if (nota >= 180) return 'text-green-600'
    if (nota >= 140) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getChipText = (nota: number) => {
    if (nota >= 900) return { text: 'Excelente', color: 'bg-green-100 text-green-700' }
    if (nota >= 800) return { text: 'Muito Bom', color: 'bg-blue-100 text-blue-700' }
    if (nota >= 700) return { text: 'Bom', color: 'bg-yellow-100 text-yellow-700' }
    if (nota >= 600) return { text: 'Regular', color: 'bg-orange-100 text-orange-700' }
    return { text: 'Precisa melhorar', color: 'bg-red-100 text-red-700' }
  }

  const chip = getChipText(notaFinal)

  return (
    <div className="min-h-screen pt-20 transition-colors duration-300">
      <Header isInternal={true} />
      <ThemeToggle />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Topo - Nota final */}
        <Card className="text-center mb-8">
          <div className="mb-4">
            <div className="number-mono text-6xl font-bold text-primary dark:text-[#F5F5F5] mb-2 transition-colors duration-300">
              {notaFinal}/1000
            </div>
            <span className={`inline-block px-3 py-1 rounded-full small font-medium ${chip.color}`}>
              {chip.text} · Próximo do Ideal
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
              <div className="w-full bg-border rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full ${
                    comp.nota >= 180 ? 'bg-green-500' :
                    comp.nota >= 140 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(comp.nota / comp.max) * 100}%` }}
                />
              </div>
              <p className="small text-secondary dark:text-[#A9A9A9] transition-colors duration-300">{comp.feedback}</p>
            </Card>
          ))}
        </div>

        {/* Pontos fortes */}
        <Card className="mb-6">
          <Heading level={3} className="mb-4">Pontos fortes</Heading>
          <ul className="space-y-2">
            {pontosFortes.map((ponto, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-secondary dark:text-[#A9A9A9] transition-colors duration-300">{ponto}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* O que melhorar */}
        <Card className="mb-6">
          <Heading level={3} className="mb-4">O que melhorar</Heading>
          <ul className="space-y-2">
            {melhorias.map((melhoria, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-accent mt-1">→</span>
                <span className="text-secondary dark:text-[#A9A9A9] transition-colors duration-300">{melhoria}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Sugestão de reescrita */}
        <Card className="mb-6">
          <Heading level={3} className="mb-4">Sugestão de reescrita</Heading>
          <div className="space-y-4">
            <div>
              <p className="small text-secondary dark:text-[#A9A9A9] mb-2 transition-colors duration-300">Trecho original:</p>
              <div className="bg-gray-50 dark:bg-[#2A2A2A] p-4 rounded-md border border-border dark:border-[#2A2A2A] transition-colors duration-300">
                <p className="small italic font-sans">
                  "A educação é importante para o desenvolvimento do país, mas ainda há muitos desafios a serem superados."
                </p>
              </div>
            </div>
            <div>
              <p className="small text-secondary dark:text-[#A9A9A9] mb-2 transition-colors duration-300">Versão sugerida:</p>
              <div className="bg-accent/5 dark:bg-accent/10 p-4 rounded-md border border-accent/20 dark:border-accent/30 transition-colors duration-300">
                <p className="small font-sans">
                  "A educação é fundamental para o desenvolvimento socioeconômico do país. Segundo dados do IBGE, 
                  entretanto, ainda existem desafios estruturais significativos, como a evasão escolar e a 
                  desigualdade de acesso, que precisam ser superados por meio de políticas públicas efetivas."
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Botões de ação */}
        <div className="flex gap-4 flex-wrap">
          <Button onClick={() => window.location.href = '/redacoes'}>
            Salvar no histórico
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/redacoes/nova'}>
            <Edit className="w-4 h-4 inline mr-2" />
            Reescrever com sugestão
          </Button>
          <Button variant="secondary">
            <Download className="w-4 h-4 inline mr-2" />
            Compartilhar PDF
          </Button>
        </div>
      </div>
    </div>
  )
}

