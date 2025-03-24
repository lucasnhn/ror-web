'use client'
import Link from 'next/link'

import s from './item.module.scss'
import { ReactNode } from 'react'

interface NavigationItemProps {
  label: string
  href: string
  icon?: ReactNode
}

export function NavigationItem({ label, href, icon }: NavigationItemProps) {
  return (
    <li className={s.item}>
      <Link href={href} className={s.link}>
        {icon}
        <span className={s.label}>{label}</span>
      </Link>
    </li>
  )
}
