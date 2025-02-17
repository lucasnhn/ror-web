'use client'
import { getSavedPreference, savePreference } from '@/utils/local-storage'
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

const LEFT_PANEL_STORAGE_KEY = 'app-shell.left-panel.expanded'

interface AppShellContextType {
  leftPanelExpanded: boolean
}

interface AppShellContextDispatchType {
  onToggleLeftPanel: (expanded: boolean) => void
}

const AppShellContext = createContext<AppShellContextType>({
  leftPanelExpanded: true,
})

const AppShellDispatchContext = createContext<AppShellContextDispatchType>({
  onToggleLeftPanel: () => {},
})

interface AppShellContextProviderProps {
  children: ReactNode
}

export function AppShellContextProvider({ children }: AppShellContextProviderProps) {
  const [leftPanelExpanded, setLeftPanelExpanded] = useState(() => {
    return getSavedPreference(LEFT_PANEL_STORAGE_KEY, true)
  })

  const handleOnToggleLeftPanel = (expanded: boolean) => {
    setLeftPanelExpanded(expanded)
    savePreference(LEFT_PANEL_STORAGE_KEY, expanded.toString())
  }

  return (
    <AppShellContext.Provider value={{ leftPanelExpanded }}>
      <AppShellDispatchContext.Provider value={{ onToggleLeftPanel: handleOnToggleLeftPanel }}>
        {children}
      </AppShellDispatchContext.Provider>
    </AppShellContext.Provider>
  )
}

type UseAppShellContextReturnType = AppShellContextType & AppShellContextDispatchType

export function useAppShellContext(): UseAppShellContextReturnType {
  const context = useContext(AppShellContext)
  const dispatch = useContext(AppShellDispatchContext)

  if (context === undefined || dispatch === undefined) {
    throw new Error('useAppShellContext must be used within a AppShellContextProvider')
  }

  return { ...context, ...dispatch }
}
