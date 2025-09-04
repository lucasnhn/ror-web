import z from 'zod'
import { createPaginationSchema } from './common'

export const PriceSchema = z
  .object({
    cpu: z.number(),
    from: z.string(),
    id: z.string(),
    machineClass: z.string(),
    memory: z.number(),
    memoryBytes: z.number(),
    price: z.number(),
    provider: z.string(),
    to: z.string(),
  })
  .passthrough()

export const PriceListSchema = z.array(PriceSchema)
export const PriceResponseSchema = createPaginationSchema(PriceSchema)
