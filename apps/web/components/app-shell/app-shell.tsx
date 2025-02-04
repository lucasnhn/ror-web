import { ReactNode } from "react";
import { AppShellLeftPanel } from "./left-panel";
import { AppShellMainNavigation } from "./main-navigation";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="grid grid-cols-[max-content_auto]">
      <AppShellLeftPanel>
        <AppShellMainNavigation />
      </AppShellLeftPanel>
      <div className="bg-(--r-layer-01)">
        {children}
      </div>
    </div>
  )
}
