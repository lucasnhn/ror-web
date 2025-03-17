'use client'
import { createContext } from 'react'

export interface ContentSwitchContextValue {
  selected: string
  setSelected: (id: string) => void
}

export const ContentSwitchContext = createContext<ContentSwitchContextValue>({
  selected: '',
  setSelected: () => {
    // No-op placeholder for default context value
    console.warn('ContentSwitchContext.setSelected called without a provider')
  },
})
