import { ReactNode } from 'react'
import { AppShellLeftPanel } from './left-panel'
import { Navigation } from './navigation/navigation'
import { LeftPanelToggleButton } from './left-panel-toggle'
import { Profile } from './profile'
import { AppShellLogo } from './app-shell-logo'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className='grid grid-cols-[max-content_auto]'>
      <AppShellLeftPanel>
        <div className='p-2 flex flex-col @min-[6rem]:flex-row items-center justify-between gap-2'>
          <AppShellLogo />
          <LeftPanelToggleButton />
        </div>
        <div className='p-2 flex flex-col gap-y-4'>
          <Navigation />
        </div>
        <div className='p-2 mt-auto'>
          <Profile />
        </div>
      </AppShellLeftPanel>
      <div className='h-screen overflow-y-auto bg-(--r-background) p-4 md:p-8'>{children}</div>
    </div>
  )
}
