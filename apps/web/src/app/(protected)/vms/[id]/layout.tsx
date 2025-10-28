/**
 * VMs Page Layout Component
 *
 * FILE OVERVIEW:
 * ------------------------
 * This file defines a React component that serves as the layout for the Virtual Machines (VMs) page.
 * It includes a header with navigation tabs and a message indicating that the page is under development.
 * The layout also provides context for the selected VM to its child components.
 *
 */
'use client'

import { Fragment, ReactNode } from 'react'
import { NotReadyMessage } from '@/components/ui/not-ready-message'
import { VMProvider } from '@/context/vm-context'
import { VMHeader } from '@/features/vms/components/vm-header'
import { useVmLayout } from '@/features/vms/hooks/vm-layout'

interface VmPageLayoutProps {
  params: Promise<{
    id: string
  }>
  children: ReactNode
}

export interface navigationItemObject {
  label: string
  href: string
}

const createTabNavigationItems = (vmId: string): navigationItemObject[] => {
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
      href: `/vms/${vmId}/raw_data`,
    },
  ]
}

export default function VmPageLayout({ params, children }: VmPageLayoutProps) {
  const { id, vm, isLoading, error } = useVmLayout({ params })

  if (isLoading) {
    return <div>Loading VM data...</div>
  }
  if (error || !vm) {
    return (
      <div className='p-6'>
        <h1 className='text-2xl font-bold text-red-600'>VM Not Found</h1>
        <p>{error || 'Could not load VM data. Please go back and select a VM.'}</p>
      </div>
    )
  }
  const tabs = createTabNavigationItems(id)
  const VMContextValue = { vm }

  return (
    <VMProvider value={VMContextValue}>
      <Fragment>
        <VMHeader tabs={tabs} />
        <NotReadyMessage className='mx-6 mt-8'>
          The VM page is still under development. Data and functionality is missing, but they are coming soon.
        </NotReadyMessage>
        <div className='pt-2 px-6 md:px-6 md:pt-8'>{children}</div>
      </Fragment>
    </VMProvider>
  )
}
