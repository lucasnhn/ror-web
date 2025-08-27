// import { clustersHandlers } from './handlers/clusters'
import { pricesHandlers } from './handlers/prices'
import { v2ResourcesHandlers } from './handlers/v2-resources'

/**
 * Mock handlers for the application.
 */
export const handlers = [...v2ResourcesHandlers, ...pricesHandlers]
