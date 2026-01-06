export async function fetchBackupRuns(
  api: Awaited<ReturnType<typeof import('@/services/ror-api').getRorApi>>,
  params: {
    page: number
    limit: number
    sort?: string
    order: 'asc' | 'desc'
    fetchAll?: boolean
  }
) {
  const listParams = new URLSearchParams()

  if (params.fetchAll) {
    // When fetchAll is true, don't set limit/offset to get all data
    if (params.sort) listParams.set('sort', params.sort)
    if (params.order) listParams.set('order', params.order)
  } else {
    // Normal pagination
    const skip = (params.page - 1) * params.limit
    listParams.set('limit', String(params.limit))
    listParams.set('offset', String(skip))
    if (params.sort) listParams.set('sort', params.sort)
    if (params.order) listParams.set('order', params.order)
  }

  const backupRuns = await api.backupRun.list(listParams)

  return {
    backupRuns: backupRuns?.resources ?? [],
  }
}
