import { createContext, useContext } from 'react'

export interface ClusterContextData {
  id: string
  cluster?: object // not use any!
}

// Create a context
const ClusterContext = createContext<ClusterContextData | undefined>(undefined)

// hook
export const useClusterContext = (): ClusterContextData => {
  const context = useContext(ClusterContext)
  if (!context) {
    throw new Error('useClusterContext must be used inside a ClusterProvider')
  }
  return context
}

// Eksport Provider-componenten
interface ClusterProviderProps {
  value: ClusterContextData
  children: React.ReactNode
}
export const ClusterProvider: React.FC<ClusterProviderProps> = ({ value, children }) => {
  return <ClusterContext.Provider value={value}>{children}</ClusterContext.Provider>
}
