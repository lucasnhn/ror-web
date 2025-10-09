import { mockVms } from '@/__mocks__/data/vms'
import { VirtualMachine } from './vms'

export const mergedVms: VirtualMachine[] = mockVms.resources.map((vm) => {
  const matchingVm = mockVms.resources.find((v) => v.metadata?.name === vm.metadata?.name)

  const merged = { ...vm, ...matchingVm }
  return merged as VirtualMachine
})
