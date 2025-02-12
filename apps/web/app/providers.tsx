import { ReactNode } from 'react'
import { AppShellContextProvider } from '@/components/app-shell/app-shell-context'
import { TooltipProvider } from '@ror/react/components/tooltip'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AppShellContextProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </AppShellContextProvider>
  )
}
