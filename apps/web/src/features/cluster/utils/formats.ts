import { format } from 'date-fns'
import { enZA } from 'date-fns/locale'

/**
 * Formats a resource usage string for display, including percentage and used/capacity values.
 *
 * @param type - The type of resource ('cpu', 'memory', 'gpu', or 'disk').
 * @param resource - An object containing resource usage data
 * @returns A formatted string representing the resource usage, or 'Data missing' if insufficient data is provided.
 */
export function formatResource(
  type: 'cpu' | 'memory' | 'gpu' | 'disk',
  resource: { capacity?: string; used?: string; percentage?: number | null }
): string {
  const { percentage, used, capacity } = resource

  const hasPercentage = percentage !== undefined && percentage !== null
  const hasUsedAndCap = used !== undefined && capacity !== undefined

  if (!hasPercentage && !hasUsedAndCap) return 'Data missing'

  const parts = []
  if (hasPercentage) parts.push(`${percentage}%`)
  if (hasUsedAndCap) {
    const unit = type === 'cpu' ? 'm' : ''
    parts.push(`(${used}${unit} of ${capacity}${unit})`)
  }

  return parts.join(' ')
}

/**
 * Formats an observation date string into a human-readable format.
 *
 * If the input date is missing, empty, or equals `'0001-01-01T00:00:00Z'`, returns `'Missing…'`.
 * Otherwise, formats the date using the `'PPp'` pattern and the `enZA` locale (same as Norway's, just in english).
 *
 * @param date - The ISO date string to format.
 * @returns The formatted date string or `'Missing…'` if the date is invalid.
 */
export function formatObservationDate(date: string) {
  if (!date || date === '0001-01-01T00:00:00Z' || date === '') {
    return 'Missing…'
  }
  return format(date, 'PPp', {
    locale: enZA,
  })
}
