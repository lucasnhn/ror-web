import { z } from 'zod'

export const ResourceMetaDataSchema = z.object({
  name: z.string().optional(),
  generateName: z.string().optional(),
  namespace: z.string().optional(),
  selfLink: z.string().optional(),
  uid: z.string().optional(),
  resourceVersion: z.string().optional(),
  generation: z.number().int().optional(),
  creationTimestamp: z.string().optional(),
  deletionTimestamp: z.string().optional(),
  deletionGracePeriodSeconds: z.number().int().optional(),
  labels: z.record(z.string(), z.string()).optional(),
  annotations: z.record(z.string(), z.string()).optional(),
  ownerReferences: z
    .array(
      z.object({
        apiVersion: z.string().optional(),
        kind: z.string().optional(),
        name: z.string().optional(),
        uid: z.string().optional(),
        controller: z.boolean().optional(),
        blockOwnerDeletion: z.boolean().optional(),
      })
    )
    .optional(),
  finalizers: z.array(z.string()).optional(),
  managedFields: z
    .array(
      z.object({
        manager: z.string().optional(),
        operation: z.string().optional(),
        apiVersion: z.string().optional(),
        time: z.string().optional(),
        fieldsType: z.string().optional(),
        fieldsV1: z.record(z.any(), z.any()).optional(),
        subresource: z.string().optional(),
      })
    )
    .optional(),
})

export const ResourceAction = z.enum(['Add', 'Delete', 'Update'])

export const Acl2Scope = z.enum(['', 'ror', 'cluster', 'project', 'datacenter', 'virtualmachine'])

export const Acl2Subject = z.enum([
  'globalscope',
  'cluster',
  'project',
  'acl',
  'apikey',
  'datacenter',
  'workspace',
  'price',
  'virtualmachine',
])

export const ResourceTagProperties = z.enum(['color'])

export const RorResourceOwnerReference = z.object({
  scope: z.string(),
  subject: z.string(),
})

export const ResourceTag = z.object({
  key: z.string(),
  value: z.string(),
  properties: z.record(z.string(), z.string()),
})

export const RorMetaDataSchema = z.object({
  version: z.string().optional(),
  lastReported: z.string().optional(),
  internal: z.boolean().optional(),
  hash: z.string().optional(),
  ownerref: RorResourceOwnerReference.optional(),
  action: ResourceAction.optional(),
  tags: z.array(ResourceTag).optional(),
})

export const RorMetaDataResponseSchema = z.object({
  metadata: RorMetaDataSchema,
})

/**
 * A schema for all v2 resources
 * No matter what type of resource that is returned it always contains the same fields.
 *
 * @remarks
 * The schema is meant to be extended by other schemas.
 *
 * * @example
 * const schema = V2ResourceSchema.extend({
 *   kubernetesCluster: KubernetesClusterSchema,
 * });
 *
 *
 */
export const V2ResourceSchema = z.object({
  kind: z.string(),
  apiVersion: z.string(),
  metadata: ResourceMetaDataSchema,
  rormeta: RorMetaDataSchema,
})

/**
 * Create a response schema with the given schema.
 *
 * @remarks
 * A response schema matches what the response might be from the /v2/resources endpoint
 *
 */
export function createV2ResourceResponseSchema<T extends z.ZodType>(schema: T) {
  return z
    .object({
      resources: z.array(schema),
    })
    .nullable()
}
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
    data: z
      .array(itemSchema)
      // The ROR API may respond with a null for an empty list
      .nullable()
      // Transform null to empty array
      .transform((data) => (data === null ? [] : Array.isArray(data) ? data : [])),
  })
}

export interface PaginationResponse<T> {
  totalCount: number
  dataCount: number
  offset: number
  data: T[]
}
