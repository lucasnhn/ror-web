import { createResource, type ResourceClient } from '../create-resource'
import { PaginationRequestParams } from '../../types'

export interface ClustersResource {
  filter: (params?: PaginationRequestParams) => Promise<void>
}

export const createClustersResource = (client: ResourceClient): ClustersResource => {
  const resource = createResource(client)

  return {
    filter: (params) => {
      const url = `/v1/clusters/filter`
      return resource.post(url, {
        limit: params?.limit ?? 25,
        skip: params?.skip ?? 0,
      })
    },
  }
}
