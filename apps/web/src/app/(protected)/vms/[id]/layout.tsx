'use client'

import { Fragment, ReactNode, useEffect, useState } from 'react'
import { routes } from '@/config/routes'
import { NotReadyMessage } from '@/components/ui/not-ready-message'
import { VMProvider } from '@/context/vm-context'

interface VmPageLayoutProps {
  params: Promise<{
    id: string
  }>
  children: ReactNode
}

export interface NavigationItemObject {
  label: string
  href: string
}

const createTabNavigationItems = (vmId: string): NavigationItemObject[] => {
  return [
    {
      label: 'Details',
      href: `/vms/${vmId}`,
    },
    {
      label: 'Metrics',
      href: `/vms/${vmId}/metrics`,
    },
    {
      label: 'Logs',
      href: `/vms/${vmId}/logs`,
    },
    {
      label: 'Raw Data',
      href: `/vms/${vmId}/raw`,
    },
  ]
}

export default function VmPageLayout({ params, children }: VmPageLayoutProps) {
  const [id, setId] = useState('')
  const [vm, setVm] = useState(null)

  useEffect(() => {
    params.then(({ id }) => {
      setId(id)
      const stored = localStorage.getItem('selectedVm')
      setVm(stored ? JSON.parse(stored) : null)
    })
  }, [params])

  if (!vm) {
    return <div>Loading VM data...</div>
  }

  const tabs = createTabNavigationItems(id)
  const VMContextProvider = { vm }

  return (
    <VMProvider value={vm}>
      <Fragment>
        <div className='border-b'>
          Kommer header her etterhvert
          {/* Lag en VMHeader under ui/vm/vm-header */}
        </div>
        <NotReadyMessage className='mx-6 mt-8'>
          The VM page is still under development.. Data and functionality is missing, but they are coming soon.
        </NotReadyMessage>
        <div className='pt-2 px-6 md:px-6 md:pt-8'>{children}</div>
      </Fragment>
    </VMProvider>
  )
}
