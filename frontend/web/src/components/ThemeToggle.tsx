'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="fixed top-24 right-6 z-40 w-12 h-12 rounded-full bg-white border border-border shadow-notion flex items-center justify-center"
        aria-label="Alternar tema"
        disabled
      >
        <div className="relative w-6 h-6">
          <Sun className="absolute inset-0 w-6 h-6 text-accent opacity-0" />
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-24 right-6 z-40 w-12 h-12 rounded-full bg-white dark:bg-[#202020] border border-border dark:border-[#2A2A2A] shadow-notion dark:shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-notion-lg dark:hover:shadow-xl group"
      aria-label="Alternar tema"
      title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
    >
      <div className="relative w-6 h-6">
        <Sun
          className={`absolute inset-0 w-6 h-6 text-accent transition-all duration-300 ${
            theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
          }`}
        />
        <Moon
          className={`absolute inset-0 w-6 h-6 text-accent transition-all duration-300 ${
            theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
          }`}
        />
      </div>
    </button>
  )
}

