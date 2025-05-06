import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
}

export async function AppShell({ children }: AppShellProps) {
  return (
    <div className='flex h-screen w-screen overflow-hidden'>
      <div className='flex-1 overflow-y-auto'>{children}</div>
    </div>
  )
}
