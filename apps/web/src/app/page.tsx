import { authGuard } from '@/features/auth/utils/auth-guard'
import { redirect } from 'next/navigation'

export default async function Home() {
  await authGuard()

  redirect('/clusters')
}
