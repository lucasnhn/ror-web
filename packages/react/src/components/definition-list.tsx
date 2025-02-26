import { clsx } from 'clsx'
import { ReactNode } from 'react'

export interface DefinitionListProps {
  children: ReactNode
  className?: string
}

export function DefinitionList({ children, className }: DefinitionListProps) {
  const classes = clsx('r-dl', className)
  return <dl className={classes}>{children}</dl>
}

export function DefinitionTerm({ children }: { children: ReactNode }) {
  return <dt className='r-dl__term'>{children}</dt>
}

export function DefinitionDescription({ children }: { children: ReactNode }) {
  return <dd className='r-dl__description'>{children}</dd>
}
