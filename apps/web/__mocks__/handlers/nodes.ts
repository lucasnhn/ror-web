import { http, HttpResponse } from 'msw'
import { getRorAPIPath } from '../utils/mock-base-url'
import nodes from '../data/nodes'

export const nodesHandlers = [
  http.get(getRorAPIPath('/v2/resources'), () => {
    return HttpResponse.json(nodes)
  }),
]
