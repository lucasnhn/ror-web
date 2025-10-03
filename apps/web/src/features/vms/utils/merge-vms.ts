import { mockVms } from '@/__mocks__/data/vms'

export const mergedVMs = (mockVms.resources || []).map((vm: any) => ({
  ...vm,
  metadata: {
    ...vm.metadata,
    creationtimestamp: {
      ...vm.metadata.creationtimestamp,
      time: vm.metadata.creationtimestamp?.time
        ? {
            date: {
              numberLong: vm.metadata.creationtimestamp.time.$date?.$numberLong,
            },
          }
        : undefined,
    },
  },
}))
