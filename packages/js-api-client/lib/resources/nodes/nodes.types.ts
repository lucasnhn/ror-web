import { z } from 'zod'
import { NodeSchema, NodesSchema } from './nodes.model'

export type Node = z.infer<typeof NodeSchema>
export type Nodes = z.infer<typeof NodesSchema>
