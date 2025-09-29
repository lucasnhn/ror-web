import { HealthStatus } from '../types/health-status'

/**
 * Determines whether the provided value is a valid `HealthStatus`.
 *
 * @param value - The value to check, which may be a string, `null`, or `undefined`.
 * @returns `true` if the value is a valid `HealthStatus`, otherwise `false`.
 */
function isHealthStatus(value: string | null | undefined): value is HealthStatus {
  if (!value) return false
  return ['ok', 'working', 'warning', 'error', 'unknown'].includes(value)
}

/**
 * Normalizes a given health status value to a valid `HealthStatus`.
 * If the provided value is not a recognized health status, returns `'unknown'`.
 *
 * @param value - The health status value to normalize. Can be a string, `null`, or `undefined`.
 * @returns The normalized `HealthStatus` value.
 */
export function normalizeHealthStatus(value: string | null | undefined): HealthStatus {
  return isHealthStatus(value) ? value : 'unknown'
}
