import type { RequestOptions } from '../core/request'
import { validateResponse } from '../core/validation'
import { VMResourceResponseSchema } from '../schemas/vm'
import type { FilterRequestOptions } from './kubernetes-cluster'
import { z } from 'zod'

export const createVirtualMachineService = (request: (requestOptions: RequestOptions) => Promise<unknown>) => ({
  filter: async (params: FilterRequestOptions) => {
    const body = {
      limit: params?.limit ?? 25,
      skip: params?.skip ?? 0,
      sort: params?.sort ?? {},
      filter: params?.filter ?? [],
    }

    const response = await request({
      method: 'POST',
      path: '/v1/virtualmachines/filter',
      body,
    })

    return validateResponse(response, VMResourceResponseSchema)
  },
  list: async (otherParams: URLSearchParams) => {
    const params = new URLSearchParams(otherParams)
    params.set('apiversion', 'general.ror.internal/v1alpha1')
    params.set('kind', 'VirtualMachine')

    const responseSchema = z.object({
      resources: z.array(VMResourceResponseSchema),
    })

    const response = await request({
      method: 'GET',
      path: '/v1/virtualmachines',
      params,
    })

    return validateResponse(response, responseSchema)
  },
  id: async (id: string) => {
    try {
      const response = await request({
        method: 'GET',
        path: `/v1/virtualmachines/${id}`,
      })
      return validateResponse(response, VMResourceResponseSchema)
    } catch (error) {
      console.log('Error fetching virtual machine by ID:', error)
      throw error
    }
  },
})
