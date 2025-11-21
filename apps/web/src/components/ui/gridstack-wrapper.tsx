'use client'

import { useEffect, useRef } from 'react'
import { GridStack, type GridStackNode, type GridStackOptions } from 'gridstack'
import 'gridstack/dist/gridstack.css'

export type GridstackItem = {
  id: string
  x: number
  y: number
  minWidth: number
  minHeight: number
}

interface GridstackWrapperProps {
  items: GridstackItem[]
  onChange?: (items: GridstackItem[]) => void
  className?: string
  options?: GridStackOptions
  children: (item: GridstackItem) => React.ReactNode
}

export function GridstackWrapper({ items, onChange, className, options, children }: GridstackWrapperProps) {
  const gridRef = useRef<HTMLDivElement | null>(null)
  const gridInstanceRef = useRef<GridStack | null>(null)

  useEffect(() => {
    if (!gridRef.current) return

    const grid = GridStack.init(
      {
        column: 12,
        cellHeight: 100, // ⬅️ make each row tall enough for your cards
        margin: 8,
        float: true,
        draggable: { handle: '.drag-handle' },
        resizable: { handles: 'e, se, s' },
        ...options,
      },
      gridRef.current
    )

    gridInstanceRef.current = grid

    grid.removeAll(false)
    grid.load(
      items.map((item) => ({
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        id: item.id,
      }))
    )

    const handleChange = (g: GridStack, nodes: GridStackNode[] = []) => {
      if (!onChange) return
      const updated = g.engine.nodes.map((n) => ({
        id: String(n.id),
        x: n.x ?? 0,
        y: n.y ?? 0,
        w: n.w ?? 1,
        h: n.h ?? 1,
      }))
      onChange(updated)
    }

    grid.on('change', handleChange)

    return () => {
      grid.off('change', handleChange)
      grid.destroy(false)
      gridInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    const grid = gridInstanceRef.current
    if (!grid) return

    grid.batchUpdate()
    grid.removeAll(false)
    grid.load(
      items.map((item) => ({
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        id: item.id,
      }))
    )
    grid.batchUpdate(false)
  }, [items])

  return (
    <div className={className}>
      <style jsx global>
        {`
          .grid-stack-item-content {
            overflow: visible;
          }
        `}
      </style>

      <div ref={gridRef} className='grid-stack'>
        {items.map((item) => (
          <div
            key={item.id}
            className='grid-stack-item'
            data-gs-id={item.id}
            data-gs-x={item.x}
            data-gs-y={item.y}
            data-gs-w={item.w}
            data-gs-h={item.h}
          >
            <div className='grid-stack-item-content drag-handle rounded-lg shadow p-4 bg-[var(--r-layer)]'>
              {children(item)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
