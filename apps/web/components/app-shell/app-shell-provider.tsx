'use client'
import { ReactNode, useState } from 'react'
import { AppShellContext, AppShellDispatchContext } from './app-shell-context'

interface AppShellContextProviderProps {
  children: ReactNode
  /**
   * Default value for the sidebars state, weather it should per default be open or closed
   */
  defaultSidebarOpen: boolean
}

export function AppShellContextProvider({ children, defaultSidebarOpen = true }: AppShellContextProviderProps) {
  const [leftPanelExpanded, setLeftPanelExpanded] = useState(defaultSidebarOpen)

  const handleOnToggleLeftPanel = (expanded: boolean) => {
    setLeftPanelExpanded(expanded)
  }

  return (
    <AppShellContext.Provider value={{ leftPanelExpanded }}>
      <AppShellDispatchContext.Provider value={{ onToggleLeftPanel: handleOnToggleLeftPanel }}>
        {children}
      </AppShellDispatchContext.Provider>
    </AppShellContext.Provider>
  )
}
