import { z } from 'zod'
import { ValidationError } from './errors'

/**
 * Validates response data against a Zod schema
 *
 * @param data - The unknown data to validate
 * @param schema - The Zod schema to validate against
 * @returns The validated and typed data
 * @throws {ValidationError} When validation fails, with detailed error information
 *
 * @example
 * const userSchema = z.object({ id: z.string(), name: z.string() });
 * try {
 *   const validatedUser = validateResponse(responseData, userSchema);
 *   // validatedUser is now typed as { id: string, name: string }
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     console.error('Validation errors:', error.validationErrors);
 *   }
 * }
 */
export function validateResponse<T>(data: unknown, schema: z.ZodType<T>): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Record<string, string[]> = {}

      for (const issue of error.errors) {
        const path = issue.path.join('.')
        if (!formattedErrors[path]) {
          formattedErrors[path] = []
        }
        formattedErrors[path].push(issue.message)
      }

      throw new ValidationError('Response validation failed', formattedErrors)
    }
    throw error
  }
}
