import { ResourceKind } from '../../constants'
import { createResource, type ResourceClient } from '../create-resource'
import { NodeSchema, NodeResponseSchema } from './nodes.model'
import type { Node, NodeResponse } from './nodes.types'

export interface NodeResource {
  list: () => Promise<NodeResponse>
  get: (id: string) => Promise<Node>
  listByCluster: (clusterId: string) => Promise<NodeResponse>
}

export const createNodesResource = (client: ResourceClient): NodeResource => {
  const resource = createResource(client)

  return {
    list: async () => {
      const searchParams = new URLSearchParams()
      searchParams.set('ownerScope', 'Node')
      searchParams.set('ownerSubject', 'ror scope: node')
      searchParams.set('apiversion', 'general.ror.internal/v1alpha1')
      searchParams.set('kind', ResourceKind.Node)
      const url = `/v2/resources`
      const response = await resource.get(url)
      const validatedData = NodeResponseSchema.parse(response)
      return validatedData
    },
    get: async (id: string) => {
      const url = `/v2/resources/uuid/${id}`
      const response = await resource.get(url)
      return NodeSchema.parse(response)
    },
    listByCluster: async (clusterId: string) => {
      const searchParams = new URLSearchParams()
      searchParams.set('kind', ResourceKind.Node)
      searchParams.set('apiversion', 'general.ror.internal/v1alpha1')
      searchParams.set('ownerScope', 'cluster')
      searchParams.set('ownerSubject', clusterId)

      const url = `/v2/resources?${searchParams.toString()}`
      const response = await resource.get(url)
      const validatedData = NodeResponseSchema.parse(response)
      return validatedData
    },
  }
}
