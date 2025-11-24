import React from 'react'

interface HeadingProps {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4
  className?: string
}

export const Heading: React.FC<HeadingProps> = ({ children, level = 2, className = '' }) => {
  const baseStyles = 'font-semibold text-primary dark:text-[#F5F5F5] mb-4'
  
  const levels = {
    1: 'text-5xl font-bold mb-6',
    2: 'text-3xl font-semibold mb-5',
    3: 'text-2xl font-semibold mb-4',
    4: 'text-xl font-semibold mb-3',
  }

  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <Tag className={`${baseStyles} ${levels[level]} ${className}`}>
      {children}
    </Tag>
  )
}

