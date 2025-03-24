import { useContext } from 'react'
import { AppShellContext, AppShellDispatchContext } from './app-shell-context'
import type { AppShellContextDispatchType, AppShellContextType } from './app-shell-context'

type UseAppShellContextReturnType = AppShellContextType & AppShellContextDispatchType

export function useAppShellContext(): UseAppShellContextReturnType {
  const context = useContext(AppShellContext)
  const dispatch = useContext(AppShellDispatchContext)

  if (context === undefined || dispatch === undefined) {
    throw new Error('useAppShellContext must be used within a AppShellContextProvider')
  }

  return { ...context, ...dispatch }
}
