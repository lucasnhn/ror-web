import type { ReactNode } from 'react'

interface RootLayoutProps {
  children: ReactNode
}

export default async function ProtectedLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <div className='w-full'>
      <div className='flex h-screen w-full overflow-hidden'>
        <div className='flex-1 overflow-y-auto'>{children}</div>
      </div>
    </div>
  )
}
