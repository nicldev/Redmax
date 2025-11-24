import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-[#202020] border border-border dark:border-[#2A2A2A] rounded-md p-4
        shadow-notion dark:shadow-lg
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:shadow-notion-lg dark:hover:shadow-xl' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

