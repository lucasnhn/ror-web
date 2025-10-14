/**
 * VMs View Switch Component
 * FILE OVERVIEW:
 * ------------------------
 * This file defines a React component that provides a switch to toggle between different views (grid and list) for displaying Virtual Machines (VMs).
 * It uses URL search parameters to manage the current view state and updates the URL accordingly when the view is changed.
 */

'use client'
import { ContentSwitch, Switch } from '@ror/react/components/content-switch'
import { useRouter, useSearchParams } from 'next/navigation'

export function ClusterPageViewSwitch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleOnViewChange = (value: string) => {
    const url = '/vms'
    const params = new URLSearchParams(searchParams)

    // Clear any pagination parameters from the list view
    params.delete('page')
    params.delete('limit')

    // Switch between grid and list view
    // removing the param for the default view (grid)
    if (value === 'grid' && params.has('view')) {
      params.delete('view')
    } else {
      params.set('view', value)
    }

    const newUrl = params.size === 0 ? url : `${url}?${params.toString()}`

    router.push(newUrl)
  }

  const selected = searchParams.get('view') ?? 'grid'

  return (
    <ContentSwitch defaultSelected={selected} onChange={handleOnViewChange}>
      <Switch name='grid'>Grid view</Switch>
      <Switch name='list'>List view</Switch>
    </ContentSwitch>
  )
}
