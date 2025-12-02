'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './Button'
import { useAuth } from '@/contexts/AuthContext'

interface HeaderProps {
  isInternal?: boolean
}

export const Header: React.FC<HeaderProps> = ({ isInternal = false }) => {
  const pathname = usePathname()
  const { user } = useAuth()

  const externalLinks = [
    { href: '/#funcionalidades', label: 'Funcionalidades' },
  ]

  const internalLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/redacoes', label: 'Redações' },
    { href: '/perfil', label: 'Perfil' },
  ]

  const links = isInternal ? internalLinks : externalLinks

  const getUserInitial = (name?: string) => {
    if (!name) return 'U'
    return name.charAt(0).toUpperCase()
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-[#191919]/80 backdrop-blur-sm border-b border-border dark:border-[#2A2A2A] z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="section-title-serif text-2xl text-primary dark:text-[#F5F5F5] transition-colors duration-300">
            ConexãoSaber
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-secondary dark:text-[#A9A9A9] hover:text-primary dark:hover:text-[#F5F5F5] transition-colors ${
                  pathname === link.href ? 'text-primary dark:text-[#F5F5F5] font-medium' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {!isInternal && (
              <>
                <Link href="/login" className="text-secondary dark:text-[#A9A9A9] hover:text-primary dark:hover:text-[#F5F5F5] transition-colors">
                  Entrar
                </Link>
                <Button onClick={() => window.location.href = '/cadastro'}>
                  Começar Agora
                </Button>
              </>
            )}
            {isInternal && (
              <Link href="/perfil">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-medium">
                  {getUserInitial(user?.name)}
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
