import { authGuard } from '@/features/auth/utils/auth-guard'

export default async function Home() {
  await authGuard()
  return <h1>Welcome to ROR</h1>
}
