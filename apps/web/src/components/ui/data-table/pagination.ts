/**
 * Interface representing pagination parameters for item range calculation.
 */
export interface GetItemRangeOptions {
  /**
   * The current page that is being viewed
   */
  pageIndex: number
  /**
   * The number of items being displayed per page
   */
  pageSize: number
  /**
   * The total number of items that exist (not only on display)
   */
  max: number
}

/**
 * Generate a string representing the range of items displayed in a paginated list.
 */
export function getItemRangeText({ pageIndex, pageSize, max }: GetItemRangeOptions): string {
  const startItem = pageIndex * pageSize + 1
  const endItem = Math.min((pageIndex + 1) * pageSize + 1, max)

  return `${startItem}-${endItem} of ${max} items`
}
