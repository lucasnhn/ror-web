import { AppShell } from '@/components/layout/app-shell/app-shell'
import type { ReactNode } from 'react'

interface RootLayoutProps {
  children: ReactNode
}

export default async function ProtectedLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <div className='w-full'>
      <AppShell>{children}</AppShell>
    </div>
  )
}
