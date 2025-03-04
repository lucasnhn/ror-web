import { ReactNode } from 'react'
import { AppShellContextProvider } from '@/components/app-shell/app-shell-provider'
import { TooltipProvider } from '@ror/react/components/tooltip'
import { MSWProvider } from './mock-provider'

interface ProvidersProps {
  children: ReactNode
  defaultSidebarOpen: boolean
}

export function Providers({ children, defaultSidebarOpen }: ProvidersProps) {
  return (
    <MSWProvider>
      <AppShellContextProvider defaultSidebarOpen={defaultSidebarOpen}>
        <TooltipProvider>{children}</TooltipProvider>
      </AppShellContextProvider>
    </MSWProvider>
  )
}
