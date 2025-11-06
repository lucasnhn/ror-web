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
import { normalizeParams } from '@/features/cluster/utils/normalize-params'
import { fetchVms } from '@/features/vms/services/fetch-vms'
import { getRorApi } from '@/services/ror-api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ROR - VM',
  description: 'View virtual machines',
}

export const dynamic = 'force-dynamic'

export default async function VMPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const session = await authGuard()
  const user = session.user
  const api = await getRorApi()

  const sp = await searchParams
  const params = normalizeParams(sp)

  const fetchedVms = await fetchVms(api, params)
  const vms = fetchedVms.vms

  return (
    <div className='w-full flex flex-col'>
      <Header title='Virtual machines' />
      <PageView user={user} vms={vms} params={params} />
    </div>
  )
}
