import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// @ts-expect-error - hack to prevent hot reload errors
module.hot?.dispose(() => {
  worker.stop() // Stop the worker when the module is replaced (HMR)
})
