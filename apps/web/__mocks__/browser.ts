import { setupWorker } from 'msw/browser'

export const worker = setupWorker()

// @ts-expect-error - hack to prevent hot reload errors
module.hot?.dispose(() => {
  worker.stop()
})
