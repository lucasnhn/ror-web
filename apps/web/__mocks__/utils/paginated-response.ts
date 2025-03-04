export interface PaginatedResponse<T> {
  data: T[]
  dataCount: number
  offset: number
  totalCount: number
}

/**
 * Create a mocked paginated response following the same structure provided by the ROR API
 */
export const createPaginatedResponse = <T>(data: T[]): PaginatedResponse<T> => ({
  data: data,
  dataCount: data.length,
  offset: 0,
  totalCount: data.length,
})
