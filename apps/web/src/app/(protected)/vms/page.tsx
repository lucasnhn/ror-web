import { authGuard } from '@/features/auth/utils/auth-guard'
import { mockVms } from '@/__mocks__/data/vms'
import PageView from './page-view'
import { Header } from '@/components/layout/app-shell/header'

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

  const vms = (mockVms.resources || []).map((vm: any) => ({
    ...vm,
    metadata: {
      ...vm.metadata,
      creationtimestamp: {
        ...vm.metadata.creationtimestamp,
        time: vm.metadata.creationtimestamp?.time
          ? {
              date: {
                numberLong: vm.metadata.creationtimestamp.time.$date?.$numberLong,
              },
            }
          : undefined,
      },
    },
  }))
  const params = { page, limit, sort, order, view, filters, skip }

  return (
    <div className='w-full flex flex-col'>
      <Header title='Virtual Machines' />
      <PageView className='f' user={user} vms={vms} params={params} />
    </div>
  )
}
