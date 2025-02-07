'use client';
import { createContext, ReactNode, useContext, useState } from "react";

interface AppShellContextType {
  leftPanelExpanded: boolean;
}

interface AppShellContextDispatchType {
  onToggleLeftPanel: (expanded: boolean) => void;
}

const AppShellContext = createContext<AppShellContextType>({
  leftPanelExpanded: true,
});

const AppShellDispatchContext = createContext<AppShellContextDispatchType>({
  onToggleLeftPanel: () => {},
});

interface AppShellContextProviderProps {
  children: ReactNode;
}

export function AppShellContextProvider({ children }: AppShellContextProviderProps) {
  const [leftPanelExpanded, setLeftPanelExpanded] = useState(true);

  const handleOnToggleLeftPanel = (expanded: boolean) => {
    setLeftPanelExpanded(expanded);
  }

  return (
    <AppShellContext.Provider value={{ leftPanelExpanded }}>
      <AppShellDispatchContext.Provider value={{ onToggleLeftPanel: handleOnToggleLeftPanel }}>
        {children}
      </AppShellDispatchContext.Provider>
    </AppShellContext.Provider>
  );
};

type UseAppShellContextReturnType = AppShellContextType & AppShellContextDispatchType;

export function useAppShellContext(): UseAppShellContextReturnType {
  const context = useContext(AppShellContext)
  const dispatch = useContext(AppShellDispatchContext)

  if (context === undefined || dispatch === undefined) {
    throw new Error('useAppShellContext must be used within a AppShellContextProvider')
  }

  return { ...context, ...dispatch }
}
