import { clustersHandlers } from './handlers/clusters'
import { nodesHandlers } from './handlers/nodes'

export const handlers = [...clustersHandlers, ...nodesHandlers]
