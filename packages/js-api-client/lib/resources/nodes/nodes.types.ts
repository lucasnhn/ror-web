import { z } from 'zod'
import { NodeSchema, NodeResponseSchema } from './nodes.model'

export type Node = z.infer<typeof NodeSchema>
export type NodeResponse = z.infer<typeof NodeResponseSchema>
