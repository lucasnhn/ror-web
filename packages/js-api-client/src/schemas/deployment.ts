import { z } from 'zod'
import { createV2ResourceResponseSchema, V2ResourceSchema } from './common'

const DeploymentStatusSchema = z.object({
  replicas: z.number(),
  availableReplicas: z.number(),
  readyReplicas: z.number(),
  updateReplicas: z.number(),
})

export const DeploymentSchema = V2ResourceSchema.extend({
  node: z.object({
    status: DeploymentStatusSchema,
  }),
})

export const DeploymentResponseSchema = createV2ResourceResponseSchema(DeploymentSchema)
