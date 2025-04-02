import { ResourceKind } from '../../constants'
import { createResource, type ResourceClient } from '../create-resource'
import { NodeSchema, NodesSchema } from './nodes.model'
import type { Node, Nodes } from './nodes.types'

export interface NodeResource {
  list: () => Promise<Nodes>
  get: (id: string) => Promise<Node>
}

export const createNodesResource = (client: ResourceClient): NodeResource => {
  const resource = createResource(client)

  return {
    list: async () => {
      const searchParams = new URLSearchParams()
      searchParams.set('ownerScope', 'node')
      searchParams.set('ownerSubject', 'ror scope: node')
      searchParams.set('apiversion', 'general.ror.internal/v1alpha1')
      searchParams.set('kind', ResourceKind.Nodes)
      const url = `/v2/resources`
      const response = await resource.get(url)
      const validatedData = NodesSchema.parse(response)
      return validatedData
    },
    get: async (id: string) => {
      const url = `/v2/resources/uuid/${id}`
      const response = await resource.get(url)
      return NodeSchema.parse(response)
    },
  }
}
