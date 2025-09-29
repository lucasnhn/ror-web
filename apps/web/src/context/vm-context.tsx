'use client'

import { VirtualMachine } from '@/app/(protected)/vms/interfaces'
import { createContext, useContext } from 'react'

export interface VMContextData {
  vm: VirtualMachine
}

// Create a context
const VMContext = createContext<VMContextData | undefined>(undefined)

// hook
export const useVMContext = (): VMContextData => {
  const context = useContext(VMContext)
  if (!context) {
    throw new Error('useVMContext must be used inside a VMProvider')
  }
  return context
}

// Provider-component
interface VMProviderProps {
  value: VMContextData
  children: React.ReactNode
}
export const VMProvider: React.FC<VMProviderProps> = ({ value, children }) => {
  return <VMContext.Provider value={value}>{children}</VMContext.Provider>
}
