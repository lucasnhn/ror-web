import type { RequestOptions } from '../core/request'
import { validateResponse } from '../core/validation'
import { UserSelfSchema } from '../schemas/user'

export const createUsersService = (request: (requestOptions: RequestOptions) => Promise<unknown>) => ({
  self: async () => {
    const response = await request({
      method: 'GET',
      path: '/v2/self',
    })
    return validateResponse(response, UserSelfSchema)
  },
})
