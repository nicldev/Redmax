'use client'

import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { ThemeToggle } from '@/components/ThemeToggle'
import Link from 'next/link'

export default function Login() {
  return (
    <div className="min-h-screen pt-20 transition-colors duration-300">
      <Header isInternal={false} />
      <ThemeToggle />
      
      <div className="max-w-md mx-auto px-6 py-12">
        <Card className="p-8">
          <Heading level={2} className="text-center mb-8">
            Entrar
          </Heading>
          <form className="space-y-6">
            <div>
              <label className="block small font-medium text-secondary dark:text-[#A9A9A9] mb-2 transition-colors duration-300">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block small font-medium text-secondary dark:text-[#A9A9A9] mb-2 transition-colors duration-300">
                Senha
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
                placeholder="••••••••"
              />
            </div>
            <Button className="w-full" onClick={(e) => {
              e.preventDefault()
              window.location.href = '/dashboard'
            }}>
              Entrar
            </Button>
          </form>
          <p className="text-center small text-secondary dark:text-[#A9A9A9] mt-6 transition-colors duration-300">
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="text-accent hover:underline">
              Criar conta
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}

