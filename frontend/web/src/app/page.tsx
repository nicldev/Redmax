'use client'

import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { ThemeToggle } from '@/components/ThemeToggle'
import { FileText, CheckCircle2, TrendingUp, Sparkles, BarChart3, Clock } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <Header isInternal={false} />
      <ThemeToggle />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-notion mx-auto text-center">
          <Heading level={1} className="mb-6">
            A forma mais moderna de treinar redação para o ENEM.
          </Heading>
          <p className="body-large text-secondary dark:text-[#A9A9A9] mb-8 max-w-2xl mx-auto transition-colors duration-300">
            Receba notas de 0 a 1000 com correção automática e prática contínua.
          </p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <Button onClick={() => window.location.href = '/cadastro'}>
              Começar Grátis
            </Button>
            <span className="text-secondary dark:text-[#A9A9A9] small transition-colors duration-300">sem cartão, ilimitado</span>
          </div>
          
          {/* Mockup Image Placeholder */}
          <div className="bg-white dark:bg-[#202020] border border-border dark:border-[#2A2A2A] rounded-lg shadow-notion-lg dark:shadow-lg p-8 max-w-4xl mx-auto transition-colors duration-300">
            <div className="aspect-video bg-gradient-to-br from-accent/10 to-accent/5 rounded-md flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-accent mx-auto mb-4" />
                <p className="text-secondary dark:text-[#A9A9A9] transition-colors duration-300">Mockup da ferramenta</p>
                <p className="small text-secondary/70 dark:text-[#A9A9A9]/70 transition-colors duration-300">Editor estilo Notion com avaliação por IA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="funcionalidades" className="py-20 px-6 bg-white dark:bg-[#191919] transition-colors duration-300">
        <div className="max-w-notion mx-auto">
          <Heading level={2} className="text-center mb-12">
            Como funciona
          </Heading>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: 'Escreva sua redação',
                description: 'Use nosso editor limpo e focado, sem distrações.',
              },
              {
                icon: CheckCircle2,
                title: 'Receba avaliação completa por competência',
                description: 'Análise detalhada das 5 competências do ENEM.',
              },
              {
                icon: TrendingUp,
                title: 'Acompanhe sua evolução',
                description: 'Veja seu progresso e melhore suas notas ao longo do tempo.',
              },
            ].map((step, index) => (
              <Card key={index} className="text-center">
                <div className="w-12 h-12 rounded-full border-2 border-accent flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-sans text-xl font-semibold mb-2">{step.title}</h3>
                <p className="body text-secondary dark:text-[#A9A9A9] transition-colors duration-300">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recursos principais */}
      <section className="py-20 px-6">
        <div className="max-w-notion mx-auto">
          <Heading level={2} className="text-center mb-12">
            Recursos principais
          </Heading>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'Avaliação automática', desc: 'IA avançada para correção instantânea' },
              { icon: FileText, title: 'Sugestões de melhoria', desc: 'Feedback detalhado e acionável' },
              { icon: BarChart3, title: 'Comparação entre versões', desc: 'Veja sua evolução ao longo do tempo' },
              { icon: Clock, title: 'Modo simulado', desc: 'Treine com tempo real do ENEM' },
              { icon: TrendingUp, title: 'Estatísticas de evolução', desc: 'Acompanhe seu progresso detalhado' },
            ].map((feature, index) => (
              <Card key={index}>
                <feature.icon className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-secondary dark:text-[#A9A9A9] transition-colors duration-300">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call final */}
      <section className="py-20 px-6">
        <div className="max-w-notion mx-auto">
          <Card className="text-center py-12">
            <Heading level={2} className="mb-4">
              Pronto para subir suas notas? Comece hoje.
            </Heading>
            <Button onClick={() => window.location.href = '/cadastro'}>
              Criar conta
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border dark:border-[#2A2A2A] py-8 px-6 transition-colors duration-300">
        <div className="max-w-notion mx-auto text-center text-secondary dark:text-[#A9A9A9] small transition-colors duration-300">
          <p>© 2024 ConexãoSaber. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

