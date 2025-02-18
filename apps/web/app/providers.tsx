import { ReactNode } from 'react'
import { AppShellContextProvider } from '@/components/app-shell/app-shell-provider'
import { TooltipProvider } from '@ror/react/components/tooltip'

interface ProvidersProps {
  children: ReactNode
  defaultSidebarOpen: boolean
}

export function Providers({ children, defaultSidebarOpen }: ProvidersProps) {
  return (
    <AppShellContextProvider defaultSidebarOpen={defaultSidebarOpen}>
      <TooltipProvider>{children}</TooltipProvider>
    </AppShellContextProvider>
  )
}
