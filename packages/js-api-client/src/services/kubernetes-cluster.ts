import type { RequestOptions } from '../core/request'
import { validateResponse } from '../core/validation'
import { createV2ResourceResponseSchema } from '../schemas/common'
import { KubernetesClusterResponseSchema, KubernetesClusterSchema } from '../schemas/kubernetes-cluster'
import { ClusterSchema, ClustersResponseSchema } from '../schemas/kubernetes-cluster-v1'

export interface Filter {
  field: string
  value: string
  matchMode: string
}

export interface FilterRequestOptions {
  limit?: number
  skip?: number
  sort?: {
    sortField: string
    sortOrder: number
  }[]
  filter?: Filter[]
}

export const createKubernetesClusterService = (request: (requestOptions: RequestOptions) => Promise<unknown>) => ({
  /**
   * @deprecated use list instead
   */
  filter: async (options: FilterRequestOptions) => {
    const body = {
      limit: options?.limit ?? 25,
      skip: options?.skip ?? 0,
      sort: options?.sort ?? {},
      filter: options?.filter ?? [],
    }

    const response = await request({
      method: 'POST',
      path: '/v1/clusters/filter',
      body,
    })

    return validateResponse(response, ClustersResponseSchema)
  },
  list: async (otherParams: URLSearchParams) => {
    console.log('Fetching Kubernetes clusters with list method...')

    const params = new URLSearchParams(otherParams)
    params.set('apiversion', 'general.ror.internal/v1alpha1')
    params.set('kind', 'KubernetesCluster')
    console.log('Request parameters:', params.toString())

    const responseSchema = createV2ResourceResponseSchema(KubernetesClusterResponseSchema)

    const response = await request({
      method: 'GET',
      path: '/v2/resources',
      params,
    })

    console.log('Response received:', response)
    console.log('Response schema received:', responseSchema)
    return validateResponse(response, responseSchema)
  },
  id: async (id: string) => {
    console.log('Fetching Kubernetes cluster by ID:', id)
    try {
      console.log('Try past response:', id)
      const response = await request({
        method: 'GET',
        path: `/v2/resources/uid/${id}`,
      })
      console.log('Fetching past response:', id)
      return validateResponse(response, KubernetesClusterSchema)
    } catch (error) {
      console.error('Error fetching cluster by ID:', error)
      throw error
    }
  },
  idV1: async (id: string) => {
    const response = await request({
      method: 'GET',
      path: `/v1/clusters/${id}`,
    })
    return validateResponse(response, ClusterSchema)
  },
})
