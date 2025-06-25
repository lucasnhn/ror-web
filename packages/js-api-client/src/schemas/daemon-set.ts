import { z } from 'zod'
import { createV2ResourceResponseSchema, V2ResourceSchema } from './common'

const DaemonSetStatusSchema = z.object({
  NumberReady: z.number(),
  NumberUnavailable: z.number(),
  NumberMisscheduled: z.number(),
  NumberAvailable: z.number(),
  UpdatedNumberScheduled: z.number(),
  DesiredNumberScheduled: z.number(),
  CurrentNumberScheduled: z.number(),
})

export const DaemonSetSchema = V2ResourceSchema.extend({
  node: z.object({
    status: DaemonSetStatusSchema,
  }),
})

export const DaemonSetResponseSchema = createV2ResourceResponseSchema(DaemonSetSchema)
