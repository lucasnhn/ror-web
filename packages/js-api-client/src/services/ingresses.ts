import type { RequestOptions } from '../core/request'
import { validateResponse } from '../core/validation'
import { createV2ResourceResponseSchema } from '../schemas/common'
import { IngressResponseSchema, IngressSchema } from '../schemas/ingress'

export const createIngressesService = (request: (requestOptions: RequestOptions) => Promise<unknown>) => ({
  list: async (otherParams: URLSearchParams) => {
    const params = new URLSearchParams(otherParams)
    params.set('apiversion', 'networking.k8s.io/v1')
    params.set('kind', 'Ingress')

    const response = await request({
      method: 'GET',
      path: '/v2/resources',
      params,
    })
    const responseSchema = createV2ResourceResponseSchema(IngressResponseSchema)
    return validateResponse(response, responseSchema)
  },
  byId: async (id: string) => {
    const response = await request({
      method: 'GET',
      path: `/v2/resources/uuid/${id}`,
    })
    return validateResponse(response, IngressSchema)
  },
})
