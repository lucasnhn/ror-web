import { mockVms } from '@/__mocks__/data/vms'

export const mergedVMs = (mockVms.resources || []).map((vm) => {
  const metadata = vm.metadata
  const creationtimestamp = metadata?.creationtimestamp
  return {
    ...vm,
    metadata: metadata
      ? {
          ...metadata,
          creationtimestamp: creationtimestamp
            ? {
                ...creationtimestamp,
                time: creationtimestamp.time
                  ? {
                      date: {
                        numberLong: creationtimestamp.time.$date?.$numberLong,
                      },
                    }
                  : undefined,
              }
            : undefined,
        }
      : undefined,
  }
})
