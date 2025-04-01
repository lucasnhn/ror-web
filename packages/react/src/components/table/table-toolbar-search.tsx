'use client'
import { clsx } from 'clsx'
import { Search } from '../search'
import type { SearchProps } from '../search'

export interface TableToolbarSearchProps extends SearchProps {
  className?: string
}

export function TableToolbarSearch({ className, ...rest }: TableToolbarSearchProps) {
  const classes = clsx('r-table__toolbar-search', className)
  return (
    <div className={classes}>
      <Search {...rest} />
    </div>
  )
}
