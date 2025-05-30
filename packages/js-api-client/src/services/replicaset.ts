import type { RequestOptions } from '../core/request'
import { validateResponse } from '../core/validation'
import { ReplicaSetResponseSchema, ReplicaSetSchema } from '../schemas/replicaset'

export const createReplicaSetService = (request: (requestOptions: RequestOptions) => Promise<unknown>) => ({
  list: async (otherParams: URLSearchParams) => {
    const params = new URLSearchParams(otherParams)
    params.set('apiversion', 'general.ror.internal/v1alpha1')
    params.set('kind', 'ReplicaSet')

    const response = await request({
      method: 'GET',
      path: '/v2/resources',
      params,
    })

    return validateResponse(response, ReplicaSetResponseSchema)
  },
  byId: async (id: string) => {
    const response = await request({
      method: 'GET',
      path: `/v2/resources/uuid/${id}`,
    })

    return validateResponse(response, ReplicaSetSchema)
  },
  listByCluster: async (clusterId: string) => {
    const params = new URLSearchParams()
    params.set('kind', 'ReplicaSet')
    params.set('apiversion', 'general.ror.internal/v1alpha1')
    params.set('ownerScope', 'cluster')
    params.set('ownerSubject', clusterId)

    const response = await request({
      method: 'GET',
      path: '/v2/resources',
      params,
    })

    return validateResponse(response, ReplicaSetResponseSchema)
  },
})
