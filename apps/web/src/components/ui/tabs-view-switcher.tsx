'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { LayoutGrid, List } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export function TabsViewSwitcher() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selected = searchParams.get('view') ?? 'grid'

  const handleChange = (value: string) => {
    const url = '/clusters'
    const params = new URLSearchParams(searchParams)

    // Clean pagination
    params.delete('page')
    params.delete('limit')

    if (value === 'grid') {
      params.delete('view')
    } else {
      params.set('view', value)
    }

    router.push(params.size === 0 ? url : `${url}?${params.toString()}`)
  }

  return (
    <Tabs defaultValue={selected} value={selected} onValueChange={handleChange}>
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
