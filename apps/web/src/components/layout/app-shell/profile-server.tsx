import { authGuard } from '@/features/auth/utils/auth-guard'
import { ProfileClient } from './profile-client'

interface ProfileServerProps {
  className?: string
}

export async function ProfileServer({ className }: ProfileServerProps) {
  const session = await authGuard()
  return <ProfileClient user={session?.user ?? undefined} className={className} />
}
