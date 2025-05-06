import { ReactNode } from 'react'
import { MSWProvider } from './mock-provider'
import { SidebarProvider, SidebarTrigger } from '@/components/shadcn/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { getDarkModePreferenceAction } from '@/actions/dark-mode'
import { ColorSchemeProvider } from '@/context/color-theme-context'
import { cookies } from 'next/headers'

interface ProvidersProps {
  children: ReactNode
}

export async function Providers({ children }: ProvidersProps) {
  const colorScheme = await getDarkModePreferenceAction()
  console.log('colorScheme', colorScheme)
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

  return (
    <MSWProvider>
      <ColorSchemeProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          {/* <SidebarProvider> */}
          {colorScheme ? <AppSidebar colorScheme={colorScheme} /> : null}
          {/* <AppSidebar /> */}
          <main>{children}</main>
        </SidebarProvider>
      </ColorSchemeProvider>
    </MSWProvider>
  )
}
