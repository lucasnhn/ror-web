'use client'

import { Tooltip } from '@ror/react/components/tooltip'
import Link from 'next/link'
import { RorLogo } from '@/components/common/ror-logo'

export function Logo() {
  return (
    <Tooltip content='Homepage' side='right'>
      <Link
        href='/'
        className='w-8 h-8 cursor-pointer hover:bg-neutral-100 flex items-center justify-center rounded-sm shrink-0'
      >
        <RorLogo className='w-8 h-8' />
      </Link>
    </Tooltip>
  )
}
