import { z } from 'zod'

/**
 * Create a Zod schema for pagination response
 *
 * @remarks
 * Useful for validating paginated responses with a schema of choice
 *
 * @example
 * const userSchema = z.object({
 *   id: z.string().uuid(),
 *   email: z.string().email(),
 *   name: z.string().min(2).max(100),
 * })
 * const paginationSchema = createPaginationSchema(userSchema)
 * const validData = paginationSchema.parse({
 *   totalCount: 100,
 *   dataCount: 10,
 *   offset: 0,
 *   data: [
 *     { id: '1', email: 'user1@example.com', name: 'User 1' },
 *     { id: '2', email: 'user2@example.com', name: 'User 2' },
 *   ],
 * })
 *
 */
export function createPaginationSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    totalCount: z.number(),
    dataCount: z.number(),
    offset: z.number(),
    data: z.array(itemSchema),
  })
}

export interface PaginationResponse<T> {
  totalCount: number
  dataCount: number
  offset: number
  data: T[]
}
