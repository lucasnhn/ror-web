import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
}

export async function AppShell({ children }: AppShellProps) {
  // const colorScheme = await getDarkModePreferenceAction()
  return (
    <div className='flex h-screen w-screen overflow-hidden'>
      {/* <AppShellLeftPanel>
        <div className='p-2'>
          <Logo />
        </div>
        <div className='p-3 flex flex-col gap-y-4'>
          <Navigation />
        </div>
        <div className='p-3 mt-auto flex flex-col @min-[6rem]:flex-row items-center justify-between gap-2'>
          <Profile />
          <div className='flex flex-col @min-[6rem]:flex-row items-center justify-end gap-2'>
            <ThemeToggle colorScheme={colorScheme} />
            <LeftPanelToggleButton />
          </div>
        </div>
      </AppShellLeftPanel> */}
      <div className='flex-1 overflow-y-auto'>{children}</div>
    </div>
  )
}
