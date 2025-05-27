import type { RequestOptions } from '../core/request'

export const createPodsService = (Request: (RequestOptions: RequestOptions) => Promise<unknown>) => ({
  list: async () => {},
  byId: async () => {},
  listByCluster: async () => {},
})
