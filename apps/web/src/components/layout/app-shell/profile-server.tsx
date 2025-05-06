import { authGuard } from '@/features/auth/utils/auth-guard'
import { ProfileClient } from './profile-client'

export async function ProfileServer() {
  const session = await authGuard()
  return <ProfileClient user={session?.user ?? undefined} />
}
