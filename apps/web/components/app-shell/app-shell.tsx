import { ReactNode } from "react";
import { AppShellLeftPanel } from "./left-panel";
import { MainNavigation } from "./main-navigation";
import { Profile } from "./profile";
import { LeftPanelToggleButton } from "./left-panel-toggle";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
      <div className="grid grid-cols-[max-content_auto]">
        <AppShellLeftPanel>
          <div className="p-2">
            <MainNavigation />
          </div>
          <div className="p-2 pr-2 py-2 mt-auto transition-all duration-150">
            <div className="h-full flex flex-col items-start justify-between gap-2 @min-[6rem]:flex-row">
              <Profile />
              <LeftPanelToggleButton />
            </div>
          </div>
        </AppShellLeftPanel>
        <div className="h-screen overflow-y-auto bg-(--r-background) p-4 md:p-8">
          {children}
        </div>
      </div>
  )
}
