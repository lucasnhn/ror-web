export async function fetchVms(
  api: Awaited<ReturnType<typeof import('@/services/ror-api').getRorApi>>,
  params: {
    page: number
    limit: number
    sort?: string
    order: 'asc' | 'desc'
  }
) {
  const listParams = new URLSearchParams()
  listParams.set('limit', '1000') // Force high limit
  listParams.set('offset', '0') // Start from beginning
  if (params.sort) listParams.set('sort', params.sort)

  const virtualmachines = await api.virtualMachine.list(listParams)

  return {
    vms: virtualmachines?.resources ?? [],
  }
}
