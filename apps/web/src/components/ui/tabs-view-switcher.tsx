'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { LayoutGrid, List } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const LOCAL_STORAGE_KEY = 'clusters:view-mode'

export function TabsViewSwitcher() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [mounted, setMounted] = useState(false)
  const [selected, setSelected] = useState('grid')

  useEffect(() => {
    const fromUrl = searchParams.get('view')
    const fromStorage = localStorage.getItem(LOCAL_STORAGE_KEY) ?? 'grid'
    const view = fromUrl ?? fromStorage

    setSelected(view)
    setMounted(true)

    // If view doesn't match URL, update the URL to reflect current state
    const params = new URLSearchParams(searchParams)
    if (view === 'grid') {
      params.delete('view')
    } else {
      params.set('view', view)
    }

    const url = '/clusters'
    router.replace(params.size === 0 ? url : `${url}?${params.toString()}`)
  }, [searchParams, router])

  const handleChange = (value: string) => {
    const url = '/clusters'
    const params = new URLSearchParams(searchParams)
    params.delete('page')
    params.delete('limit')

    if (value === 'grid') {
      params.delete('view')
    } else {
      params.set('view', value)
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, value)
    router.push(params.size === 0 ? url : `${url}?${params.toString()}`)
    setSelected(value)
  }

  if (!mounted) return null

  return (
    <Tabs value={selected} onValueChange={handleChange}>
      <TabsList>
        <TabsTrigger value='grid'>
          <LayoutGrid />
        </TabsTrigger>
        <TabsTrigger value='list'>
          <List />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
