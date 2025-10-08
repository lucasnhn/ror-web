import { Environment } from '../types/environment'

/**
 * Maps environment names to their corresponding color identifiers.
 *
 * The color values are used for UI representation of different environments.
 */
export const envColors: Record<Environment, 'red' | 'yellow' | 'blue' | 'emerald' | 'orange' | 'gray'> = {
  prod: 'red',
  qa: 'yellow',
  dev: 'blue',
  test: 'emerald',
  mgmt: 'red',
  kurs: 'orange',
  undefined: 'gray',
}

/**
 * A mapping of environment names to their corresponding background color classes.
 * Supports both default and dark mode variants.
 */
const envBgColors: Record<Environment, string[]> = {
  prod: ['bg-red-500', 'dark:bg-red-600'],
  qa: ['bg-yellow-500', 'dark:bg-yellow-600'],
  dev: ['bg-blue-500', 'dark:bg-blue-600'],
  test: ['bg-emerald-500', 'dark:bg-emerald-600'],
  mgmt: ['bg-red-500', 'dark:bg-red-600'],
  kurs: ['bg-orange-400', 'dark:bg-orange-500'],
  undefined: ['bg-gray-500', 'dark:bg-gray-600'],
}

/**
 * Returns the background color classes associated with a given environment.
 *
 * @param env - The environment to get colors for.
 * @returns An array of background color class names for the specified environment.
 */
export function getEnvironmentColors(env: Environment | undefined) {
  return envBgColors[env ?? 'undefined'] ?? ['bg-gray-500', 'dark:bg-gray-600']
}

/**
 * Returns a pair of background and text color class names for the given environment,
 * optimized for high visual contrast. If the environment is undefined or not found,
 * defaults to gray color classes.
 *
 * @param env - The environment for which to retrieve color classes.
 * @returns An array containing the background and text color class names.
 */
export function getHighDifferenceEnvironmentColors(env: Environment | undefined) {
  return envBgColors[env ?? 'undefined'] ?? ['bg-gray-100', 'text-gray-900']
}
