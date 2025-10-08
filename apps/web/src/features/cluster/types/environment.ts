/**
 * List of possible environment values for clusters.
 */
export const environmentValues = ['prod', 'qa', 'dev', 'test', 'mgmt', 'kurs', 'undefined'] as const

/**
 * Represents the possible environment types for a cluster.
 */
export type Environment = (typeof environmentValues)[number]
