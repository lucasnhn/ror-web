import { createResource, type ResourceClient } from '../create-resource'
import { PaginationRequestParams } from '../../types'
import { createPaginationSchema, PaginationResponse } from '../paginated-response.model'
import { Cluster, type ClusterType } from './clusters.model'
export interface ClustersResource {
  filter: (params?: PaginationRequestParams) => Promise<PaginationResponse<ClusterType>>
  get: (id: string) => Promise<ClusterType>
}

export const createClustersResource = (client: ResourceClient): ClustersResource => {
  const resource = createResource(client)

  return {
    filter: async (params) => {
      const url = `/v1/clusters/filter`
      const response = await resource.post(url, {
        limit: params?.limit ?? 25,
        skip: params?.skip ?? 0,
      })
      const schema = createPaginationSchema(Cluster)
      const validatedData = schema.parse(response)
      return validatedData
    },
    get: async (id: string) => {
      const url = `/v1/clusters/${id}`
      const response = await resource.get(url)
      return Cluster.parse(response)
    },
  }
}
