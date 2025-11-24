import React from 'react'

interface HeadingProps {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4
  className?: string
}

export const Heading: React.FC<HeadingProps> = ({ children, level = 2, className = '' }) => {
  const baseStyles = 'text-primary dark:text-[#F5F5F5] mb-4'
  
  const levels = {
    1: 'title-serif text-[clamp(42px,5vw,56px)] mb-6',
    2: 'section-title-serif text-[clamp(32px,4vw,40px)] mb-5',
    3: 'font-sans text-[clamp(24px,3vw,28px)] font-semibold mb-4',
    4: 'font-sans text-[clamp(20px,2.5vw,24px)] font-semibold mb-3',
  }

  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <Tag className={`${baseStyles} ${levels[level]} ${className}`}>
      {children}
    </Tag>
  )
}

