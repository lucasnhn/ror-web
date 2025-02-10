'use client';
import { type ReactNode } from "react";
import { RorLogo } from "../common/ror-logo";
import Link from "next/link";
import { motion } from 'motion/react';
import clsxm from "@/utils/clsxm";
import { useAppShellContext } from "./app-shell-context";

interface AppShellLeftPanelProps {
  children: ReactNode;
}

const variants = {
  expanded: {
    "--left-panel-width": "16rem",
  },
  collapsed: {
    "--left-panel-width": "3rem",
  }
}

export function AppShellLeftPanel({ children }: AppShellLeftPanelProps) {
  const { leftPanelExpanded } = useAppShellContext();
  const classes = clsxm("@container w-(--left-panel-width) bg-(--r-background) text-(--r-background-inverse) h-screen border-r border-(--r-border-subtle-00) transition-width duration-200 hide-scrollbar overflow-y-auto")
  return (
    <motion.div layout initial="expanded" transition={{ duration: 0.1 }} variants={variants} animate={leftPanelExpanded ? "expanded": "collapsed"} className={classes}>
      <div className="flex flex-col h-full">
        <div className="p-2 flex items-center justify-between">
          <Link href="/" className="w-8 h-8 cursor-pointer hover:bg-neutral-100 flex items-center justify-center rounded-sm shrink-0">
            <RorLogo className="w-8 h-8" />
          </Link>
        </div>
        {children}
      </div>
    </motion.div>
  )
}
