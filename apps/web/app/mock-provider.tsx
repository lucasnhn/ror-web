'use client'

import { Suspense, use } from 'react'
import { handlers } from '@/__mocks__/handlers'
import { onUnhandledRequest } from '@/__mocks__/utils/on-unhandled-request'

const mockingEnabledPromise =
  typeof window !== 'undefined'
    ? import('@/__mocks__/browser').then(async ({ worker }) => {
        await worker.start({
          onUnhandledRequest: onUnhandledRequest,
        })
        worker.use(...handlers)

        // console.log(worker.listHandlers())
      })
    : Promise.resolve()

export function MSWProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // If MSW is enabled, we need to wait for the worker to start,
  // so we wrap the children in a Suspense boundary until it's ready.
  return (
    <Suspense fallback={null}>
      <MSWProviderWrapper>{children}</MSWProviderWrapper>
    </Suspense>
  )
}

function MSWProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  use(mockingEnabledPromise)
  return children
}
