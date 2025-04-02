import { z } from 'zod'

const ResourceMetaDataSchema = z.object({})

const RorMetaDataSchema = z.object({})

/**
 * A resource schema contains information that is always returned by the API.
 * No matter what type of resource that is returned.
 *
 * @remarks
 * The schema is meant to be extended by other schemas.
 *
 */
export const ResourceSchema = z.object({
  kind: z.string(),
  apiVersion: z.string(),
  metadata: ResourceMetaDataSchema,
  rormeta: RorMetaDataSchema,
})

export const createResourceResponseSchema = <T>(schema: z.ZodType<T>) =>
  z.object({
    resources: z.array(schema),
  })
