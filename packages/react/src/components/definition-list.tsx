import { clsx } from 'clsx'
import { HTMLAttributes, ReactNode } from 'react'

export interface DefinitionListProps extends HTMLAttributes<HTMLDListElement> {
  /**
   * Specify an optional className to be applied to the button
   */
  className?: string

  /**
   * Specify the direction of the definition list
   */
  direction?: 'horizontal' | 'vertical'

  /**
   * Specify the content of the definition list (should be a list of DefinitionTerm and DefinitionDescription components)
   */
  children: ReactNode
}

export function DefinitionList({ className, direction = 'horizontal', children, ...rest }: DefinitionListProps) {
  const classes = clsx(
    'r-dl',
    {
      'r-dl--horizontal': direction === 'horizontal',
      'r-dl--vertical': direction === 'vertical',
    },
    className
  )
  return (
    <dl className={classes} {...rest}>
      {children}
    </dl>
  )
}

interface DefinitionTermProps extends HTMLAttributes<HTMLElement> {
  className?: string
  children: ReactNode
}

export function DefinitionTerm({ className, children, ...rest }: DefinitionTermProps) {
  const classes = clsx('r-dl__term', className)
  return (
    <dt className={classes} {...rest}>
      {children}
    </dt>
  )
}

interface DefinitionDescriptionProps extends HTMLAttributes<HTMLElement> {
  className?: string
  children: ReactNode
}

export function DefinitionDescription({ className, children, ...rest }: DefinitionDescriptionProps) {
  const classes = clsx('r-dl__description', className)
  return (
    <dd className={classes} {...rest}>
      {children}
    </dd>
  )
}
