'use client'

import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ChevronDown, ChevronUp, CheckCircle2, Circle, BookOpen, Target } from 'lucide-react'
import { useState } from 'react'

export default function Roadmap() {
  const [expanded, setExpanded] = useState<number | null>(2)

  const semanas = [
    {
      id: 1,
      titulo: 'Semana 1 — Estrutura básica',
      objetivos: ['Entender a estrutura da redação ENEM', 'Praticar introdução'],
      leituras: ['Manual do candidato ENEM', 'Exemplos de redações nota 1000'],
      tarefas: [
        { id: 1, texto: 'Estudar estrutura da redação', concluida: true },
        { id: 2, texto: 'Escrever 2 introduções', concluida: true },
        { id: 3, texto: 'Revisar conectivos básicos', concluida: true },
      ],
    },
    {
      id: 2,
      titulo: 'Semana 2 — Desenvolvimento',
      objetivos: ['Aprender a desenvolver argumentos', 'Praticar parágrafos de desenvolvimento'],
      leituras: ['Técnicas de argumentação', 'Repertórios socioculturais'],
      tarefas: [
        { id: 1, texto: 'Estudar tipos de argumentos', concluida: true },
        { id: 2, texto: 'Escrever 2 parágrafos de desenvolvimento', concluida: true },
        { id: 3, texto: 'Redação completa', concluida: false },
      ],
    },
    {
      id: 3,
      titulo: 'Semana 3 — Argumentação',
      objetivos: ['Fortalecer argumentação', 'Usar dados e estatísticas'],
      leituras: ['Como usar dados na redação', 'Fontes confiáveis'],
      tarefas: [
        { id: 1, texto: 'Prática de argumentos', concluida: false },
        { id: 2, texto: 'Revisão de conectivos', concluida: false },
        { id: 3, texto: 'Redação completa', concluida: false },
      ],
    },
    {
      id: 4,
      titulo: 'Semana 4 — Proposta de intervenção',
      objetivos: ['Aprender a elaborar proposta completa', 'Detalhar agentes e ações'],
      leituras: ['Como fazer proposta de intervenção', 'Exemplos práticos'],
      tarefas: [
        { id: 1, texto: 'Estudar estrutura da proposta', concluida: false },
        { id: 2, texto: 'Escrever 3 propostas', concluida: false },
        { id: 3, texto: 'Redação completa', concluida: false },
      ],
    },
    {
      id: 5,
      titulo: 'Semana 5 — Revisão geral',
      objetivos: ['Revisar todos os aspectos', 'Praticar redações completas'],
      leituras: ['Revisão geral do conteúdo', 'Dicas finais'],
      tarefas: [
        { id: 1, texto: 'Revisar estrutura completa', concluida: false },
        { id: 2, texto: 'Escrever 2 redações completas', concluida: false },
        { id: 3, texto: 'Simulado completo', concluida: false },
      ],
    },
  ]

  const progressoGeral = 35

  const toggleExpanded = (id: number) => {
    setExpanded(expanded === id ? null : id)
  }

  return (
    <div className="min-h-screen pt-20 transition-colors duration-300">
      <Header isInternal={true} />
      <ThemeToggle />
      
      <div className="max-w-notion mx-auto px-6 py-12">
        <Heading level={2} className="mb-8">
          Seu plano para alcançar a nota 1000
        </Heading>

        {/* Progresso geral */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-accent" />
              <span className="font-semibold">Progresso geral</span>
            </div>
            <span className="text-2xl font-bold text-primary dark:text-[#F5F5F5] transition-colors duration-300">{progressoGeral}%</span>
          </div>
          <div className="w-full bg-border dark:bg-[#2A2A2A] rounded-full h-3">
            <div
              className="bg-accent h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressoGeral}%` }}
            />
          </div>
        </Card>

        {/* Blocos de semanas */}
        <div className="space-y-4">
          {semanas.map((semana) => {
            const isExpanded = expanded === semana.id
            const tarefasConcluidas = semana.tarefas.filter(t => t.concluida).length
            const progressoSemana = (tarefasConcluidas / semana.tarefas.length) * 100

            return (
              <Card key={semana.id}>
                <button
                  onClick={() => toggleExpanded(semana.id)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{semana.titulo}</h3>
                    <div className="flex items-center gap-4 text-sm text-secondary dark:text-[#A9A9A9] transition-colors duration-300">
                      <span>{tarefasConcluidas}/{semana.tarefas.length} tarefas concluídas</span>
                      <div className="w-32 bg-border dark:bg-[#2A2A2A] rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{ width: `${progressoSemana}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-secondary dark:text-[#A9A9A9] transition-colors duration-300" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-secondary dark:text-[#A9A9A9] transition-colors duration-300" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-border space-y-6">
                    {/* Objetivos */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-accent" />
                        Objetivos
                      </h4>
                      <ul className="space-y-2">
                        {semana.objetivos.map((obj, index) => (
                          <li key={index} className="text-secondary flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Leituras */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-accent" />
                        Leituras recomendadas
                      </h4>
                      <ul className="space-y-2">
                        {semana.leituras.map((leitura, index) => (
                          <li key={index} className="text-secondary flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span>{leitura}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tarefas */}
                    <div>
                      <h4 className="font-semibold mb-3">Tarefas da semana</h4>
                      <div className="space-y-3">
                        {semana.tarefas.map((tarefa) => (
                          <div key={tarefa.id} className="flex items-center gap-3">
                            {tarefa.concluida ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-border dark:text-[#2A2A2A]" />
                            )}
                            <span className={tarefa.concluida ? 'line-through text-secondary dark:text-[#A9A9A9]' : 'text-primary dark:text-[#F5F5F5]'} transition-colors duration-300>
                              {tarefa.texto}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => window.location.href = '/perfil'}>
            Redefinir roadmap
          </Button>
        </div>
      </div>
    </div>
  )
}

