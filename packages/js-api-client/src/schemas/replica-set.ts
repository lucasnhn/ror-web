import { z } from 'zod'
import { createV2ResourceResponseSchema, V2ResourceSchema } from './common'

const ReplicaSetSpecSelectorMatchExpressions = z.object({
  key: z.string(),
  operator: z.string(),
  values: z.array(z.string()),
})

const ReplicaSetSpecSelector = z.object({
  mathExpressions: z.array(ReplicaSetSpecSelectorMatchExpressions),
  matchLabels: z.record(z.string(), z.string()),
})

const ReplicaSetSpecSchema = z.object({
  replicas: z.number(),
  selector: ReplicaSetSpecSelector,
})

const ReplicaSetStatusSchema = z.object({
  AvailableReplicas: z.number(),
  ReadyReplicas: z.number(),
  replicas: z.number(),
})

export const ReplicaSetSchema = V2ResourceSchema.extend({
  node: z.object({
    spec: ReplicaSetSpecSchema,
    status: ReplicaSetStatusSchema,
  }),
})

export const ReplicaSetResponseSchema = createV2ResourceResponseSchema(ReplicaSetSchema)
