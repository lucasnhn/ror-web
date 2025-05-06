import { authGuard } from '@/features/auth/utils/auth-guard'
import { ProfileClientWrapper } from './profile-client-wrapper'

interface Props {
  className?: string
}

export async function ProfileServer({ className }: Props) {
  const session = await authGuard()
  return <ProfileClientWrapper user={session?.user} className={className} />
}
