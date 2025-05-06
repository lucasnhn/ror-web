'use client'

import Link from 'next/link'
import { RorLogo } from '@/components/ui/ror-logo'

export function Logo() {
  return (
    <Link
      href='/'
      className='w-8 h-8 cursor-pointer hover:bg-neutral-100 flex items-center justify-center rounded-sm shrink-0'
    >
      <RorLogo className='w-8 h-8' />
    </Link>
  )
}
