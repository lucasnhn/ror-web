'use client'

import { cn } from '@/utils/clsxm'
import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout'
import { useState, useEffect } from 'react'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

interface GridLayoutWrapperProps {
  className?: string
  layouts: Layouts
  onLayoutChange?: (layout: Layout[]) => void
  onBreakpointChange?: (breakpoint: string) => void
  layoutKey?: number // optional, for "reset" triggers
  children: React.ReactNode
}

/**
 * Reusable responsive grid wrapper that works for both stateful and stateless layouts.
 * - Stateless mode: pass static layouts and ignore callbacks (like in VMDetails)
 * - Stateful mode: pass onLayoutChange, onBreakpointChange, and layoutKey (like ClusterDetails)
 */
export const GridLayoutWrapper = ({
  className,
  layouts,
  onLayoutChange,
  onBreakpointChange,
  layoutKey,
  children,
}: GridLayoutWrapperProps) => {
  const [internalKey, setInternalKey] = useState(layoutKey ?? 0)

  // When layoutKey changes externally (e.g. Reset button pressed), re-render layout
  useEffect(() => {
    if (layoutKey !== undefined) setInternalKey(layoutKey)
  }, [layoutKey])

  return (
    <div className='w-full border rounded-xl p-2'>
      <style>{`
        .react-resizable-handle :after { border-color: black; }
        .dark .react-resizable-handle::after { border-color: white; }
        .react-resizable-handle::after { scale: 2; margin-right: 8px; margin-bottom: 8px; }
        .react-grid-item.react-grid-placeholder { background-color: #58acf2; }
        .dark .react-grid-item.react-grid-placeholder { background-color: #3e88c5; }
      `}</style>

      <ResponsiveGridLayout
        className={cn(
          'layout w-full',
          '[&>div]:bg-[var(--r-layer)] [&>div]:rounded-lg [&>div]:p-4 [&>div]:shadow [&>div]:cursor-move',
          className
        )}
        key={internalKey}
        layouts={layouts}
        breakpoints={{ lg: 1856, md: 1200, sm: 640, xs: 512 }}
        cols={{ lg: 42, md: 24, sm: 12, xs: 6 }}
        rowHeight={30}
        draggableHandle='.drag-handle'
        draggableCancel='.no-drag'
        onLayoutChange={onLayoutChange}
        onBreakpointChange={onBreakpointChange}
      >
        {children}
      </ResponsiveGridLayout>
    </div>
  )
}
