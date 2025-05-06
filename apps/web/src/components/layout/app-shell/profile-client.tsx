'use client'

import Image from 'next/image'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover'
import Link from 'next/link'
import s from './profile.module.scss'
import { type User } from '@auth/core/types'

export function ProfileClient({ user }: { user?: Partial<User> }) {
  if (!user) return null

  const initials =
    user?.name
      ?.split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase() || '?'

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={s.profile}>
          <div className={s.avatar}>
            {user?.image ? (
              <Image src={user.image} alt={user.name || 'User'} width={32} height={32} className={s.avatar} />
            ) : (
              <span className={s.label}>{initials}</span>
            )}
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
  )
}
