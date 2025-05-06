import { Layer } from '@ror/react'
import { ThemeToggle } from './layout/app-shell/theme-toggle'
import { SidebarFooter, SidebarTrigger } from './shadcn/sidebar'
import { ColorScheme } from '@/utils/dark-mode'
import { Profile } from './layout/app-shell/profile'
import { ProfileServer } from './layout/app-shell/profile-server'

interface AppSidebarFooterProps {
  colorScheme: ColorScheme
}

export function AppSidebarFooter({ colorScheme }: AppSidebarFooterProps) {
  return (
    <SidebarFooter className='mb-2 flex flex-row group-data-[collapsible=icon]:flex-col items-center justify-between'>
      <Layer level={0}>
        <ProfileServer className='bg-[var(--r-layer)] flex items-center justify-center w-7 h-7 rounded-full' />
      </Layer>
      {/* <ProfileServer className="flex items-center justify-center w-7 h-7 rounded-full" /> */}

      <div className='flex flex-row group-data-[collapsible=icon]:flex-col items-center gap-2'>
        <ThemeToggle colorScheme={colorScheme} />
        <SidebarTrigger />
      </div>
    </SidebarFooter>
  )
}
