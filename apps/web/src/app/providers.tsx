import { getDarkModePreferenceAction } from '@/actions/dark-mode'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/shadcn/sidebar'
import { ColorSchemeProvider } from '@/context/color-theme-context'
import { cookies } from 'next/headers'
import { ReactNode } from 'react'
import { MSWProvider } from './mock-provider'

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
          {colorScheme ? <AppSidebar colorScheme={colorScheme} /> : null}
          <main>{children}</main>
        </SidebarProvider>
      </ColorSchemeProvider>
    </MSWProvider>
  )
}
