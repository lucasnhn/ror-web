'use client'

import dynamic from 'next/dynamic'
import type { User } from '@auth/core/types'

const ProfileClient = dynamic(() => import('./profile-client'), { ssr: false })

export function ProfileClientWrapper({ user, className }: { user?: Partial<User>; className?: string }) {
  return <ProfileClient user={user} className={className} />
}
