import { createContext } from 'react'

export interface AppShellContextType {
  leftPanelExpanded: boolean
}

export interface AppShellContextDispatchType {
  onToggleLeftPanel: (expanded: boolean) => void
}

export const AppShellContext = createContext<AppShellContextType>({
  leftPanelExpanded: true,
})

export const AppShellDispatchContext = createContext<AppShellContextDispatchType>({
  onToggleLeftPanel: () => {},
})
