import type { ReactNode } from "react";
import { RorLogo } from "../common/ror-logo";
import Link from "next/link";

interface AppShellLeftPanelProps {
  children: ReactNode;
}

export function AppShellLeftPanel({ children }: AppShellLeftPanelProps) {
  return (
    <div data-state="expanded" className="bg-(--r-color-background) text-(--r-color-background-inverse) h-screen w-3xs md:data-[state=expanded]:w-3xs border-r border-(--r-border-subtle-00) transition-width duration-200 hide-scrollbar overflow-y-auto">
      <div className="p-2 flex items-center justify-between">
        <Link href="/" className="w-8 h-8 cursor-pointer hover:bg-neutral-100 flex items-center justify-center rounded-sm">
          <RorLogo className="w-7 h-7" />
        </Link>
        <div className="h-full flex items-center">
          <button className="w-8 h-8 cursor-pointer hover:bg-neutral-100 flex items-center justify-center rounded-sm">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 text-(--r-color-background-inverse)"
                viewBox="0 0 24 24"
              >
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <path d="M9 3v18"></path>
              </svg>
          </button>
        </div>
      </div>
      <div className="p-2">
        {children}
      </div>
    </div>
  )
}
