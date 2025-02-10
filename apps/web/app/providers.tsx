import { ReactNode } from 'react'
import { AppShellContextProvider } from '@/components/app-shell/app-shell-context'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return <AppShellContextProvider>{children}</AppShellContextProvider>
}
