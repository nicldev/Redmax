'use client'

import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Plus, Filter } from 'lucide-react'
import Link from 'next/link'

export default function Redacoes() {
  const redacoes = [
    { id: 1, titulo: 'Desafios da educação digital', data: '15/01/2024', tema: 'Educação', nota: 720, c1: 140, c2: 180, c3: 160, c4: 140, c5: 100 },
    { id: 2, titulo: 'Sustentabilidade urbana', data: '12/01/2024', tema: 'Meio Ambiente', nota: 680, c1: 130, c2: 160, c3: 150, c4: 130, c5: 110 },
    { id: 3, titulo: 'Inclusão social', data: '10/01/2024', tema: 'Social', nota: 750, c1: 150, c2: 180, c3: 170, c4: 150, c5: 100 },
    { id: 4, titulo: 'Tecnologia e sociedade', data: '08/01/2024', tema: 'Tecnologia', nota: 710, c1: 140, c2: 170, c3: 160, c4: 140, c5: 100 },
    { id: 5, titulo: 'Saúde pública', data: '05/01/2024', tema: 'Saúde', nota: 690, c1: 130, c2: 170, c3: 150, c4: 140, c5: 100 },
  ]

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
            <select className="px-3 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300">
              <option>Todos os temas</option>
              <option>Educação</option>
              <option>Meio Ambiente</option>
              <option>Social</option>
              <option>Tecnologia</option>
              <option>Saúde</option>
            </select>
            <select className="px-3 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300">
              <option>Todas as datas</option>
              <option>Última semana</option>
              <option>Último mês</option>
              <option>Últimos 3 meses</option>
            </select>
            <select className="px-3 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300">
              <option>Todas as notas</option>
              <option>700+</option>
              <option>800+</option>
              <option>900+</option>
            </select>
            <select className="px-3 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300">
              <option>Todas as competências</option>
              <option>C1 mais baixa</option>
              <option>C2 mais baixa</option>
              <option>C3 mais baixa</option>
              <option>C4 mais baixa</option>
              <option>C5 mais baixa</option>
            </select>
          </div>
        </Card>

        {/* Tabela */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Título</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Tema</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Nota</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">C1</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">C2</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">C3</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">C4</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary dark:text-[#A9A9A9] transition-colors duration-300">C5</th>
                </tr>
              </thead>
              <tbody>
                {redacoes.map((redacao) => (
                  <tr key={redacao.id} className="border-b border-border dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors">
                    <td className="py-4 px-4">
                      <Link href={`/redacoes/${redacao.id}/resultado`} className="text-primary dark:text-[#F5F5F5] hover:text-accent font-medium transition-colors duration-300">
                        {redacao.titulo}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-secondary dark:text-[#A9A9A9] text-sm transition-colors duration-300">{redacao.data}</td>
                    <td className="py-4 px-4 text-secondary dark:text-[#A9A9A9] text-sm transition-colors duration-300">{redacao.tema}</td>
                    <td className="py-4 px-4 font-semibold text-primary dark:text-[#F5F5F5] transition-colors duration-300">{redacao.nota}/1000</td>
                    <td className="py-4 px-4 text-sm text-secondary dark:text-[#A9A9A9] transition-colors duration-300">{redacao.c1}</td>
                    <td className="py-4 px-4 text-sm text-secondary dark:text-[#A9A9A9] transition-colors duration-300">{redacao.c2}</td>
                    <td className="py-4 px-4 text-sm text-secondary dark:text-[#A9A9A9] transition-colors duration-300">{redacao.c3}</td>
                    <td className="py-4 px-4 text-sm text-secondary dark:text-[#A9A9A9] transition-colors duration-300">{redacao.c4}</td>
                    <td className="py-4 px-4 text-sm text-secondary dark:text-[#A9A9A9] transition-colors duration-300">{redacao.c5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

