import z from 'zod'
import type { RequestOptions } from '../core/request'
import { validateResponse } from '../core/validation'
import { PriceListSchema, PriceResponseSchema, PriceSchema } from '../schemas/price'

export const createPriceService = (request: (requestOptions: RequestOptions) => Promise<unknown>) => ({
  list: async () => {
    const response = await request({
      method: 'GET',
      path: '/v1/prices',
    })
    console.log('[PRICE SERVICE] Prices:', response)
    return validateResponse(response, PriceListSchema)
  },
})
