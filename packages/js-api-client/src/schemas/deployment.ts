import { z } from 'zod'
import { createV2ResourceResponseSchema, V2ResourceSchema } from './common'

const DeploymentStatus = z.object({
  replicas: z.number(),
  availableReplicas: z.number(),
  readyReplicas: z.number(),
  updateReplicas: z.number(),
})

const DeploymnentSchema = z.object({
  status: DeploymentStatus,
})

export const DeploymentSchema = V2ResourceSchema.extend({
  node: z.object({
    status: DeploymnentSchema,
  }),
})

export const DeploymentResponseSchema = createV2ResourceResponseSchema(DeploymentSchema)
