import { z } from 'zod'
import { createV2ResourceResponseSchema, V2ResourceSchema } from './common'

const configurationSpecSchema = z.object({
  type: z.string(),
  b64enc: z.boolean(),
  data: z.string(),
})

export const ConfigurationSchema = V2ResourceSchema.extend({
  node: z.object({
    spec: configurationSpecSchema,
  }),
})

export const configurationResponseSchema = createV2ResourceResponseSchema(ConfigurationSchema)
