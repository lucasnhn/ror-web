import { createResource, type ResourceClient } from '../create-resource'
import { PaginationRequestParams, SortingRequestParams } from '../../types'
import { createPaginationSchema, PaginationResponse } from '../paginated-response.model'
import { Cluster, ClusterListItem } from './clusters.model'
import type { ClusterType, ClusterListItemType } from './clusters.types'

interface FilterRequestOptions extends PaginationRequestParams {
  sort?: SortingRequestParams
}

export interface ClustersResource {
  filter: (options?: FilterRequestOptions) => Promise<PaginationResponse<ClusterListItemType>>
  get: (id: string) => Promise<ClusterType>
}

export const createClustersResource = (client: ResourceClient): ClustersResource => {
  const resource = createResource(client)

  return {
    filter: async (options) => {
      const url = `/v1/clusters/filter`
      const response = await resource.post(url, {
        limit: options?.limit ?? 25,
        skip: options?.skip ?? 0,
        sort: options?.sort ?? {},
      })
      const schema = createPaginationSchema(ClusterListItem)
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
