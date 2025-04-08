import type { ReactNode, ComponentPropsWithoutRef } from 'react'
import { clsx } from 'clsx'

export interface StructuredListWrapperProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Specify a label to be read by screen readers on the container node
   */
  'aria-label'?: string

  /**
   * Provide the contents of your StructuredListWrapper
   */
  children?: ReactNode

  /**
   * Specify an optional className to be applied to the container node
   */
  className?: string
}

export function StructuredListWrapper({
  children,
  className,
  ['aria-label']: ariaLabel = 'Structured list section',
  ...rest
}: StructuredListWrapperProps) {
  const classes = clsx('r-structured-list', className)
  return (
    <div role='table' className={classes} {...rest} aria-label={ariaLabel}>
      {children}
    </div>
  )
}

export interface StructuredListHeadProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Provide the contents of your StructuredListHead
   */
  children?: ReactNode

  /**
   * Specify an optional className to be applied to the node
   */
  className?: string
}

export function StructuredListHead({ children, className, ...rest }: StructuredListHeadProps) {
  const classes = clsx('r-structured-list-thead', className)
  return (
    <div role='rowgroup' className={classes} {...rest}>
      {children}
    </div>
  )
}

export interface StructuredListBodyProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Provide the contents of your StructuredListBody
   */
  children?: ReactNode

  /**
   * Specify an optional className to be applied to the container node
   */
  className?: string
}

export function StructuredListBody({ children, className, ...rest }: StructuredListBodyProps) {
  const classes = clsx('r-structured-list-tbody', className)

  return (
    <div className={classes} role='rowgroup' {...rest}>
      {children}
    </div>
  )
}

export interface StructuredListRowProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Provide the contents of your StructuredListRow
   */
  children?: ReactNode

  /**
   * Specify an optional className to be applied to the container node
   */
  className?: string

  /**
   * Specify whether StructuredListRow should be used as a header cell
   */
  head?: boolean
}
export function StructuredListRow({ children, className, head, onClick, ...rest }: StructuredListRowProps) {
  const classes = clsx(
    'r-structured-list-row',
    {
      'r-structured-list-row--header-row': head,
    },
    className
  )

  return (
    <div {...rest} role='row' className={classes}>
      {children}
    </div>
  )
}

export interface StructuredListCellProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Provide the contents of your StructuredListCell
   */
  children?: ReactNode

  /**
   * Specify an optional className to be applied to the container node
   */
  className?: string

  /**
   * Specify whether your StructuredListCell should be used as a header cell
   */
  head?: boolean

  /**
   * Specify whether your StructuredListCell should have text wrapping
   */
  noWrap?: boolean
}
export function StructuredListCell({ children, className, head, noWrap, ...rest }: StructuredListCellProps) {
  const classes = clsx(
    {
      'r-structured-list-th': head,
      'r-structured-list-td': !head,
      'r-structured-list-content--nowrap': noWrap,
    },
    className
  )

  if (head) {
    return (
      <span className={classes} role='columnheader' {...rest}>
        {children}
      </span>
    )
  }

  return (
    <div className={classes} role='cell' {...rest}>
      {children}
    </div>
  )
}
