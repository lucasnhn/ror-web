export type SortDirection = 'ASC' | 'DESC' | 'NONE'

// A mapping of names to SortDirection
export const SortDirection: Record<SortDirection, SortDirection> = {
  ASC: 'ASC',
  DESC: 'DESC',
  NONE: 'NONE',
}

// The default sort direction for a column going from NONE to sorted
export const DEFAULT_SORT_DIRECTION = SortDirection.ASC

// Transition the given sort direction to the next direction
// ASC -> DESC -> NONE -> ASC
export function transition(direction: SortDirection): SortDirection {
  switch (direction) {
    case SortDirection.ASC:
      return SortDirection.DESC
    case SortDirection.DESC:
      return SortDirection.NONE
    default:
      return DEFAULT_SORT_DIRECTION
  }
}
