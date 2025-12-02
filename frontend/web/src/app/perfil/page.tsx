'use client'

import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { User, Target, Edit, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { authService } from '@/lib/api/auth'

export default function Perfil() {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading, refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [school, setSchool] = useState('')
  const [grade, setGrade] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setSchool(user.school || '')
      setGrade(user.grade || '')
    }
  }, [user])

  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      await authService.updateProfile({
        name: name || undefined,
        school: school || undefined,
        grade: grade || undefined,
      })
      setSuccess('Perfil atualizado com sucesso!')
      await refreshUser()
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen pt-20 transition-colors duration-300">
      <Header isInternal={true} />
      <ThemeToggle />
      
      <div className="max-w-notion mx-auto px-6 py-12">
        <Heading level={2} className="mb-8">Perfil</Heading>

        {error && (
          <Card className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="small text-red-600 dark:text-red-400">{error}</p>
          </Card>
        )}

        {success && (
          <Card className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <p className="small text-green-600 dark:text-green-400">{success}</p>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Foto e informações básicas */}
          <Card>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {getUserInitial(user.name)}
              </div>
              <h3 className="font-sans text-xl font-semibold mb-2">{user.name}</h3>
              <p className="text-secondary dark:text-[#A9A9A9] small mb-6 transition-colors duration-300">
                {user.school || 'Estudante'}
              </p>
              <Button variant="outline" className="w-full" onClick={() => document.getElementById('form')?.scrollIntoView()}>
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
            <form id="form" onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="small text-secondary dark:text-[#A9A9A9] mb-1 block transition-colors duration-300">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="small text-secondary dark:text-[#A9A9A9] mb-1 block transition-colors duration-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-gray-100 dark:bg-[#2A2A2A] text-secondary dark:text-[#A9A9A9] cursor-not-allowed transition-colors duration-300"
                />
                <p className="small text-secondary dark:text-[#A9A9A9] mt-1">
                  O email não pode ser alterado
                </p>
              </div>
              <div>
                <label className="small text-secondary dark:text-[#A9A9A9] mb-1 block transition-colors duration-300">
                  Escola
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full px-4 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
                  placeholder="Nome da sua escola"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="small text-secondary dark:text-[#A9A9A9] mb-1 block transition-colors duration-300">
                  Série
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2 border border-border dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
                  placeholder="Ex: 3º Ano"
                  disabled={saving}
                />
              </div>
              <div className="pt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar alterações'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
