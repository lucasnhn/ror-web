'use client'

import { useEffect, useRef } from 'react'
import { GridStack, type GridStackNode } from 'gridstack'
import { createRoot } from 'react-dom/client'

function MemoryCard() {
  return (
    <div className='h-full w-full flex flex-col bg-[var(--r-layer)] p-4 rounded-md'>
      <div className='flex flex-col gap-2'>
        <div>CPU</div>
        <div>Memory</div>
        <div>GPU</div>
        <div>Disk</div>
      </div>
    </div>
  )
}

const reactRoots = new WeakMap<Element, ReturnType<typeof createRoot>>()

export default function TestDashboard() {
  const gridRef = useRef<GridStack | null>(null)

  useEffect(() => {
    const grid = GridStack.init({
      float: true,
      cellHeight: '70px',
      minRow: 1,
    })

    gridRef.current = grid

    const renderReact = (el: Element) => {
      let root = reactRoots.get(el)
      if (!root) {
        root = createRoot(el)
        reactRoots.set(el, root)
      }
      root.render(<MemoryCard />)
    }

    grid.engine.nodes.forEach((node) => {
      const item = node.el!
      const contentEl = item.querySelector('.grid-stack-item-content')!
      renderReact(contentEl)
    })

    return () => {
      grid.destroy(false)
      gridRef.current = null
    }
  }, [])

  const addNewWidget = () => {
    if (!gridRef.current) return

    const node: GridStackNode = {
      x: Math.round(12 * Math.random()),
      y: Math.round(5 * Math.random()),
      w: Math.round(1 + 3 * Math.random()),
      h: Math.round(1 + 3 * Math.random()),
    }

    const el = gridRef.current.addWidget(node)
    const contentEl = el.querySelector('.grid-stack-item-content')!
    const root = createRoot(contentEl)
    reactRoots.set(contentEl, root)
    root.render(<MemoryCard />)
  }

  return (
    <div>
      <h1>How to integrate GridStack.js with React.js</h1>
      <button type='button' onClick={addNewWidget} className='bg-blue-800 p-3 rounded-lg text-white'>
        Add Widget
      </button>
      <section className='grid-stack' />
    </div>
  )
}
