'use client'

import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover'
import Link from 'next/link'
import s from './profile.module.scss'
import { type User } from '@auth/core/types'
import { User as UserIcon } from 'lucide-react'

interface ProfileClientProps {
  user?: Partial<User>
  className?: string
}

export function ProfileClient({ user, className }: ProfileClientProps) {
  if (!user) return null
  return (
    <div className={`${className}`}>
      <Popover>
        <PopoverTrigger asChild>
          <div className={s.profile}>
            <div className={s.avatar}>
              <UserIcon className='text-neutral-800 size-5' />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent collisionPadding={8} sideOffset={4}>
            <div className={s.popover}>
              <ul className={s.menu}>
                <li>
                  <Link href='/profile'>Profile</Link>
                </li>
                <li>
                  <Link href='/api/auth/signout'>Sign out</Link>
                </li>
              </ul>
            </div>
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    </div>
  )
}
