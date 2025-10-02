import { z } from 'zod'

/**
 * Schema for validating a node pool form using Zod.
 *
 * Fields:
 * - `id`: Unique identifier for the node pool (string).
 * - `name`: Name of the node pool (string, required, minimum 1 character).
 * - `provider`: Cloud provider for the node pool (optional string).
 * - `version`: Kubernetes version for the node pool (optional string).
 * - `machineClass`: Machine class/type for the node pool (string, required, minimum 1 character).
 * - `replicas`: Number of node replicas (number, required, minimum 1).
 * - `labels`: Key-value pairs for node labels (record of string to string, defaults to empty object).
 * - `taints`: Key-value pairs for node taints, where each value is an object containing:
 *    - `value`: The taint value (string).
 *    - `effect`: The taint effect (enum: 'NoSchedule', 'PreferNoSchedule', 'NoExecute').
 *   (defaults to empty object)
 */
export const nodePoolFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  provider: z.string().optional(),
  version: z.string().optional(),
  machineClass: z.string().min(1, 'Machine class is required'),
  replicas: z.number().min(1),
  labels: z.record(z.string(), z.string()).default({}),
  taints: z
    .record(
      z.string(),
      z.object({
        value: z.string(),
        effect: z.enum(['NoSchedule', 'PreferNoSchedule', 'NoExecute']),
      })
    )
    .default({}),
})

/**
 * Represents the data structure for a node pool form, inferred from the `nodePoolFormSchema` Zod schema.
 *
 * This type is used to ensure type safety and validation for node pool form data throughout the application.
 */
export type NodePoolFormData = z.infer<typeof nodePoolFormSchema>
