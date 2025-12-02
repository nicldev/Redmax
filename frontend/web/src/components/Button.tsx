import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}) => {
  const baseStyles = 'px-6 py-2.5 rounded-md font-medium transition-all duration-200'
  
  const variants = {
    primary: 'bg-accent text-white hover:bg-blue-600 shadow-notion hover:shadow-notion-lg dark:shadow-lg dark:hover:shadow-xl',
    secondary: 'bg-white dark:bg-[#202020] text-primary dark:text-[#F5F5F5] border border-border dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-[#2A2A2A]',
    outline: 'bg-transparent text-accent border border-accent hover:bg-accent hover:text-white dark:border-accent dark:hover:bg-accent',
  }

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  )
}

