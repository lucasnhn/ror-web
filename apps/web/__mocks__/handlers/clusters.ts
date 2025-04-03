import { http, HttpResponse } from 'msw'
import { alphabetical } from 'radash'

import { clustersVersion1 } from '../data/clusters'
import { createPaginatedResponse, type PaginatedResponse } from '../utils/paginated-response'
import { getRorAPIPath } from '../utils/mock-base-url'
type ClusterVersionOne = (typeof clustersVersion1)[number]

interface FilterBody {
  limit?: number
  skip?: number
  sort?: [
    {
      sortField: 'clusterName'
      sortOrder: 1 | -1
    },
  ]
}

export const clustersHandlers = [
  http.post<never, FilterBody, PaginatedResponse<ClusterVersionOne>>(
    getRorAPIPath('/v1/clusters/filter'),
    async ({ request }) => {
      // Read the intercepted request body as JSON.
      const payload = await request.json()
      const pagination = {
        limit: payload?.limit ?? 10,
        skip: payload?.skip ?? 0,
      }

      let filteredClusters = [...clustersVersion1]

      /**
       * Manually sort the clusters by name
       * TODO: Maybe add more mocked sorting options, low priority since we are moving to v2 resource endpoint
       */
      if (Array.isArray(payload?.sort) && payload.sort.length > 0 && payload.sort[0].sortField === 'clusterName') {
        const sortOrder = payload.sort[0].sortOrder === -1 ? 'desc' : 'asc'
        filteredClusters = alphabetical(clustersVersion1, (c) => c.clusterName, sortOrder)
      }

      /**
       * Create a paginated response model using the available data
       */
      const paginatedResponse = createPaginatedResponse(pagination, filteredClusters)

      return HttpResponse.json(paginatedResponse)
    }
  ),
  http.get(getRorAPIPath('/v1/clusters/:clusterId'), ({ params }) => {
    const singleCluster = clustersVersion1.find((c) => c.clusterId === params.clusterId)

    if (!singleCluster) {
      return HttpResponse.json({ error: 'Cluster not found' }, { status: 404 })
    }

    return HttpResponse.json(singleCluster)
  }),
]
