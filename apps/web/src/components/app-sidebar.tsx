import { Sidebar } from '@/components/shadcn/sidebar'
import { ColorScheme } from '@/utils/dark-mode'
import { AppSidebarContent } from './app-sidebar-content'
import { AppSidebarFooter } from './app-sidebar-footer'
import { AppSidebarHeader } from './app-sidebar-header'

interface AppSidebarProps {
  colorScheme: ColorScheme
}

export function AppSidebar({ colorScheme }: AppSidebarProps) {
  return (
    <Sidebar collapsible='icon'>
      <AppSidebarHeader />
      <AppSidebarContent />
      <AppSidebarFooter colorScheme={colorScheme} />
    </Sidebar>
  )
}
