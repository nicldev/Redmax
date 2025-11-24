'use client'

import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Plus, TrendingUp, CheckCircle2, Clock } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const competencias = [
    { nome: 'C1 - Domínio da escrita', nota: 150, max: 200 },
    { nome: 'C2 - Compreensão', nota: 180, max: 200 },
    { nome: 'C3 - Argumentação', nota: 160, max: 200 },
    { nome: 'C4 - Coesão', nota: 140, max: 200 },
    { nome: 'C5 - Proposta', nota: 110, max: 200 },
  ]

  const mediaAtual = 740
  const redacoes = [
    { id: 1, titulo: 'Desafios da educação digital', data: '15/01/2024', tema: 'Educação', nota: 720, status: 'Avaliada' },
    { id: 2, titulo: 'Sustentabilidade urbana', data: '12/01/2024', tema: 'Meio Ambiente', nota: 680, status: 'Avaliada' },
    { id: 3, titulo: 'Inclusão social', data: '10/01/2024', tema: 'Social', nota: 750, status: 'Avaliada' },
  ]

  const tarefas = [
    { id: 1, texto: 'Fazer introdução guiada', concluida: false },
    { id: 2, texto: 'Reescrever parágrafo 2', concluida: false },
    { id: 3, texto: 'Simulado 1h', concluida: true },
  ]

  return (
    <div className="min-h-screen pt-20 transition-colors duration-300">
      <Header isInternal={true} />
      <ThemeToggle />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Interno */}
        <div className="mb-12">
          <h1 className="section-title-serif text-3xl mb-2">Olá, Nicolas 👋</h1>
          <p className="text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Pronto para treinar hoje?</p>
        </div>

        {/* Cards principais */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 - Média atual */}
          <Card>
            <h3 className="small text-secondary dark:text-[#A9A9A9] mb-4 transition-colors duration-300">Média atual</h3>
            <div className="number-mono text-4xl font-bold text-primary dark:text-[#F5F5F5] mb-6 transition-colors duration-300">
              {mediaAtual}/1000
            </div>
            <div className="space-y-3">
              {competencias.map((comp, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="small text-secondary dark:text-[#A9A9A9] transition-colors duration-300">{comp.nome}</span>
                    <span className="number-mono text-primary dark:text-[#F5F5F5] font-medium transition-colors duration-300">{comp.nota}/{comp.max}</span>
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
          </Card>

          {/* Card 2 - Evolução */}
          <Card>
            <h3 className="text-sm text-secondary dark:text-[#A9A9A9] mb-4 transition-colors duration-300">Sua evolução</h3>
            <div className="h-48 flex items-end justify-between gap-2">
              {[65, 70, 68, 72, 74].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-accent rounded-t"
                    style={{ height: `${value}%` }}
                  />
                    <span className="mono text-xs text-secondary dark:text-[#A9A9A9] mt-2 transition-colors duration-300">Sem {index + 1}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Card 3 - Tarefas */}
          <Card>
            <h3 className="text-sm text-secondary dark:text-[#A9A9A9] mb-4 transition-colors duration-300">Tarefas do dia</h3>
            <div className="space-y-3">
              {tarefas.map((tarefa) => (
                <div key={tarefa.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={tarefa.concluida}
                    readOnly
                    className="w-5 h-5 rounded border-border dark:border-[#2A2A2A]"
                  />
                  <span className={tarefa.concluida ? 'line-through text-secondary dark:text-[#A9A9A9]' : 'text-primary dark:text-[#F5F5F5]'} transition-colors duration-300>
                    {tarefa.texto}
                  </span>
                </div>
              ))}
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Título</th>
                    <th className="text-left py-3 px-4 small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Data</th>
                    <th className="text-left py-3 px-4 small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Tema</th>
                    <th className="text-left py-3 px-4 small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Nota</th>
                    <th className="text-left py-3 px-4 small font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {redacoes.map((redacao) => (
                    <tr key={redacao.id} className="border-b border-border dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors duration-300">
                      <td className="py-3 px-4">
                        <Link href={`/redacoes/${redacao.id}`} className="text-primary dark:text-[#F5F5F5] hover:text-accent transition-colors duration-300">
                          {redacao.titulo}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-secondary dark:text-[#A9A9A9] text-sm transition-colors duration-300">{redacao.data}</td>
                      <td className="py-3 px-4 text-secondary dark:text-[#A9A9A9] text-sm transition-colors duration-300">{redacao.tema}</td>
                      <td className="py-3 px-4 font-semibold text-primary dark:text-[#F5F5F5] transition-colors duration-300">{redacao.nota}/1000</td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          {redacao.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Roadmap atual */}
        <Card className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-sans text-xl font-semibold mb-2">Semana 3 — Argumentação</h3>
              <p className="text-secondary dark:text-[#A9A9A9] small transition-colors duration-300">Foco em construção de argumentos sólidos</p>
            </div>
            <Link href="/roadmap">
              <Button variant="outline">Ver Roadmap</Button>
            </Link>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Progresso da semana</span>
              <span className="font-medium">60%</span>
            </div>
            <div className="w-full bg-border dark:bg-[#2A2A2A] rounded-full h-2">
              <div className="bg-accent h-2 rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

