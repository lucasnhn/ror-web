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

export default async function VMPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const session = await authGuard()
  const user = session.user
  const sp = await searchParams

  const page = Number(sp.page ?? '1') || 1
  const limit = Number(sp.limit ?? '10') || 10
  const sort = typeof sp.sort === 'string' ? sp.sort : undefined
  const order: 'asc' | 'desc' = sp.order === 'desc' ? 'desc' : 'asc'
  const view: 'grid' | 'list' = sp.view === 'list' ? 'list' : 'grid'
  const filters = sp.filters === 'open' ? 'open' : undefined
  const skip = (page - 1) * limit

  const params = { page, limit, sort, order, view, filters, skip }

  return (
    <div className='w-full flex flex-col'>
      <Header title='Virtual Machines' />
      <PageView className='f' user={user} vms={mergedVms} params={params} />
    </div>
  )
}
