'use client'

import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { ThemeToggle } from '@/components/ThemeToggle'
import { User, Target, Edit } from 'lucide-react'

export default function Perfil() {
  return (
    <div className="min-h-screen pt-20 transition-colors duration-300">
      <Header isInternal={true} />
      <ThemeToggle />
      
      <div className="max-w-notion mx-auto px-6 py-12">
        <Heading level={2} className="mb-8">Perfil</Heading>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Foto e informações básicas */}
          <Card>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                N
              </div>
              <h3 className="text-xl font-semibold mb-2">Nicolas</h3>
              <p className="text-secondary dark:text-[#A9A9A9] text-sm mb-6 transition-colors duration-300">Estudante</p>
              <Button variant="outline" className="w-full">
                <Edit className="w-4 h-4 inline mr-2" />
                Editar perfil
              </Button>
            </div>
          </Card>

          {/* Dados básicos */}
          <Card className="md:col-span-2">
            <Heading level={3} className="mb-6 flex items-center gap-2">
              <User className="w-5 h-5" />
              Dados básicos
            </Heading>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-secondary dark:text-[#A9A9A9] mb-1 block transition-colors duration-300">Nome completo</label>
                <input
                  type="text"
                  defaultValue="Nicolas"
                  className="w-full px-4 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
                />
              </div>
              <div>
                <label className="text-sm text-secondary dark:text-[#A9A9A9] mb-1 block transition-colors duration-300">Email</label>
                <input
                  type="email"
                  defaultValue="nicolas@example.com"
                  className="w-full px-4 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
                />
              </div>
              <div>
                <label className="text-sm text-secondary dark:text-[#A9A9A9] mb-1 block transition-colors duration-300">Data de nascimento</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Meta de nota */}
        <Card className="mt-6">
          <Heading level={3} className="mb-6 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Meta de nota
          </Heading>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <label className="text-sm text-secondary dark:text-[#A9A9A9] mb-2 block transition-colors duration-300">Nota desejada</label>
              <input
                type="number"
                defaultValue={1000}
                min={0}
                max={1000}
                className="w-full px-4 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
              />
            </div>
            <div className="pt-8">
              <Button onClick={() => alert('Meta atualizada!')}>
                Salvar meta
              </Button>
            </div>
          </div>
        </Card>

        {/* Redefinir roadmap */}
        <Card className="mt-6">
          <Heading level={3} className="mb-4">Roadmap</Heading>
          <p className="text-secondary dark:text-[#A9A9A9] mb-4 transition-colors duration-300">
            Redefina seu roadmap personalizado baseado na sua meta e no seu progresso atual.
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/roadmap'}>
            Redefinir roadmap
          </Button>
        </Card>
      </div>
    </div>
  )
}

