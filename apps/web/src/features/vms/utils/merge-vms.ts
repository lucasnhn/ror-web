/**
 * Utility functions for merging Virtual Machine (VM) objects.
 *
 * This file provides logic to merge VM resources from mock data,
 * combining properties of VMs with matching metadata names.
 * The resulting array contains merged VM objects for further use in the application.
 *
 * One can't use the mock data provided directly because it's a collection, not a single VM.
 * This code finds the matching mock VM and merges its properties with the real VM for use in the page view.
 * This file introduced the possibility to override properties in the data.
 */

import { mockVms } from '@/__mocks__/data/vms'
import { VirtualMachine } from './vms'

export const mergedVms: VirtualMachine[] = mockVms.resources.map((vm) => {
  const matchingVm = mockVms.resources.find((v) => v.metadata?.name === vm.metadata?.name)

  const merged = { ...vm, ...matchingVm }
  return merged as VirtualMachine
})
