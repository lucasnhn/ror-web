import type { ReactNode } from 'react'
import clsxm from '@/utils/clsxm'

import s from './static-menu.module.scss'

interface StaticMenuProps {
  children: ReactNode
  expanded: boolean
}

export function StaticMenu({ children, expanded = false }: StaticMenuProps) {
  const classes = clsxm(s.staticMenu, {
    [s.collapsed]: !expanded,
  })
  return <div className={classes}>{children}</div>
}
