/**
 * Builds a URL with toggled query parameters based on the provided key and value.
 * If the specified key in the params matches the given value, it removes the key from the query string.
 * Otherwise, it sets the key to the given value in the query string.
 *
 * @template T - The type of the params object, (record of string, number, boolean, undefined, or null values).
 * @param params - The current query parameters as an object.
 * @param key - The key to toggle in the query parameters.
 * @param value - The value to set for the key if it is not currently active.
 * @param domain - The domain or path to prefix the URL.
 * @returns An object containing the constructed URL and a boolean indicating if the key-value pair was active.
 */
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

/**
 * Builds a URL with sorting parameters for a given domain and returns the URL along with the sorting order.
 *
 * @template T - The type of the params object, (record with string keys and values of type string, number, boolean, undefined, or null).
 * @param params - An object containing query parameters, including a 'sort' key to indicate sorting is required.
 * @param domain - The domain or path segment to prepend to the generated URL.
 * @returns An object containing the constructed URL with updated sorting order and a boolean indicating if the current order is descending,
 *          or `null` if the 'sort' parameter is not present in `params`.
 */
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
