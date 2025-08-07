import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * Mock server that intercepts requests in Node
 */
export const server = setupServer(...handlers)
