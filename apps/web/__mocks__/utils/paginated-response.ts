export interface PaginatedOptions {
  limit: number
  skip: number
}

export interface PaginatedResponse<T> {
  data: T[]
  dataCount: number
  offset: number
  totalCount: number
}

/**
 * Is not used, because it is only used in file used for v1 clusters, but will keep for reference
 * Create a mocked paginated response following the same structure provided by the ROR API
 */
export const createPaginatedResponse = <T>(
  options: PaginatedOptions = { limit: 10, skip: 0 },
  data: T[]
): PaginatedResponse<T> => {
  const slicedData = data.slice(options.skip, options.skip + options.limit)
  return {
    data: slicedData,
    dataCount: slicedData.length,
    offset: options.skip,
    totalCount: data.length,
  }
}
