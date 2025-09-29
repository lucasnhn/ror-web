export const buildToggledParams = <T extends Record<string, string | number | boolean | undefined | null>>(
  params: T,
  key: keyof T & string,
  value: string,
  domain: string
): { url: string; isActive: boolean } => {
  const entries = Object.entries(params).filter(([, v]) => v != null)
  const search = new URLSearchParams(entries.map(([k, v]) => [k, String(v)]))

  const isActive = search.get(key) === value

  if (isActive) search.delete(key)
  else search.set(key, value)

  return { url: `/${domain}?${search.toString()}`, isActive }
}

export const buildSortParams = <T extends Record<string, string | number | boolean | undefined | null>>(
  params: T,
  domain: string
): { url: string; isDesc: boolean } | null => {
  if (!params.sort) return null

  const entries = Object.entries(params).filter(([, v]) => v != null)
  const search = new URLSearchParams(entries.map(([k, v]) => [k, String(v)]))

  const currentOrder = search.get('order') === 'desc' ? 'desc' : 'asc'
  search.set('order', currentOrder === 'desc' ? 'asc' : 'desc')

  return { url: `/${domain}?${search.toString()}`, isDesc: currentOrder === 'desc' }
}
