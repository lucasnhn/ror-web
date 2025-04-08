import type { RequestOptions } from '../core/request'
import { validateResponse } from '../core/validation'
import { IngressResponseSchema, IngressSchema } from '../schemas/ingress'

export const createIngressesService = (request: (requestOptions: RequestOptions) => Promise<unknown>) => ({
  list: async (otherParams?: URLSearchParams) => {
    const params = new URLSearchParams(otherParams)
    params.set('apiversion', 'networking.k8s.io/v1')
    params.set('kind', 'Ingress')

    const response = await request({
      method: 'GET',
      path: '/v2/resources',
      params,
    })
    return validateResponse(response, IngressResponseSchema)
  },
  byId: async (id: string) => {
    const response = await request({
      method: 'GET',
      path: `/v2/resources/uuid/${id}`,
    })
    return validateResponse(response, IngressSchema)
  },
})
