/*
 * FILE OVERVIEW:
 *
 * Utility functions for building and manipulating URLs with query parameters.
 */

/**
 * Builds a URL with toggled query parameters based on the provided key and value.
 * If the specified key in the params matches the given value, it removes the key from the query string.
 * Otherwise, it sets the key to the given value in the query string.
 *
 * @template T - The type of the parameters object, which must have string, number, boolean, undefined, or null values.
 * @param params - The current query parameters as an object.
 * @param key - The key to toggle in the query parameters.
 * @param value - The value to set for the key if it is not currently active.
 * @param domain - The domain or path to prefix the URL.
 * @returns An object containing the constructed URL and a boolean indicating if the key-value pair was active.
 */
export const buildToggledParams = <T extends object>(
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
 * @template T - The type of the params object, which must be a record with string, number, boolean, undefined, or null values.
 * @param params - An object containing query parameters, including a 'sort' key to indicate sorting is required.
 * @param domain - The domain or path segment to prepend to the generated URL.
 * @returns An object containing the constructed URL with updated sorting order and a boolean indicating if the current order is descending,
 */

export const buildSortParams = <T extends object>(
  params: T,
  domain: string
): { url: string; isDesc: boolean } | null => {
  if (!('sort' in params)) return null

  const entries = Object.entries(params).filter(([, v]) => v != null)
  const search = new URLSearchParams(entries.map(([k, v]) => [k, String(v)]))

  const currentOrder = search.get('order') === 'desc' ? 'desc' : 'asc'
  search.set('order', currentOrder === 'desc' ? 'asc' : 'desc')

  return { url: `/${domain}?${search.toString()}`, isDesc: currentOrder === 'desc' }
}

/**
 * Toggles a query parameter in a given URLSearchParams object.
 * If the parameter with the specified key is set to the provided value, it will be removed.
 * Otherwise, the parameter will be set to the provided value.
 *
 * @param search - The URLSearchParams object to modify.
 * @param key - The key of the query parameter to toggle.
 * @param value - The value to set for the query parameter.
 * @returns An object containing the updated URLSearchParams and a boolean indicating if the parameter was active before toggling.
 */
export const toggleParam = (search: URLSearchParams, key: string, value: string) => {
  const isActive = search.get(key) === value
  if (isActive) search.delete(key)
  else search.set(key, value)
  return { search, isActive }
}

/**
 * Constructs a URL path for the specified domain with query parameters.
 *
 * @param domain - The domain segment to include in the URL path.
 * @param search - The URLSearchParams object containing query parameters.
 * @returns The formatted URL string in the form `/{domain}?{query}`.
 */
export const buildDomainUrl = (domain: string, search: URLSearchParams) => `/${domain}?${search.toString()}`
