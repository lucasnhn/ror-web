/**
 * List of possible effect values for node pool.
 */
export const effectValues = ['NoSchedule', 'PreferNoSchedule', 'NoExecute'] as const

/**
 * Represents the possible effect types for a node pool.
 */
export type EffectType = (typeof effectValues)[number]
