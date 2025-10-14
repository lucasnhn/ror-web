/**
 * VMs Page Component
 * FILE OVERVIEW:
 * ------------------------
 * This file defines a React component that serves as the main entry point for the Virtual Machines (VMs) page.
 * It handles authentication, data fetching, and rendering of the page layout.
 */

import { authGuard } from '@/features/auth/utils/auth-guard'
import PageView from './page-view'
import { Header } from '@/components/layout/app-shell/header'
import { mergedVms } from '@/features/vms/utils/merge-vms'
import { parseVmSearchParams, VmSearchParams } from '@/features/vms/utils/search-params'

export default async function VMPage({ searchParams }: { searchParams: Promise<VmSearchParams> }) {
  const session = await authGuard()
  const user = session.user
  const sp = await searchParams
  const params = parseVmSearchParams(sp)

  return (
    <div className='w-full flex flex-col'>
      <Header title='Virtual machines' />
      <PageView className='f' user={user} vms={mergedVms} params={params} />
    </div>
  )
}
