import { useMemo } from 'react'
import Fuse from 'fuse.js'
import type { VirtualMachine } from '@ror/js-api-client'
import { getVmFamily, getVmHostName, getVmName, getVmPowerState } from '../utils/vms'

interface UseVmSearchOptions {
  threshold?: number
  keys?: string[]
}

export const useVmSearch = (items: VirtualMachine[], options: UseVmSearchOptions = {}) => {
  const { threshold = 0.3, keys = ['label', 'hostname', 'powerState', 'family'] } = options

  const fuse = useMemo(() => {
    const flat = items.map((vm) => ({
      ...vm,
      label: vm.metadata?.name ?? getVmName(vm),
      hostname: getVmHostName(vm),
      powerState: getVmPowerState(vm),
      family: getVmFamily(vm),
    }))

    return new Fuse(flat, {
      keys,
      threshold,
    })
  }, [items, threshold, keys])

  const search = (query: string): VirtualMachine[] => {
    if (!query.trim()) {
      return items
    }
    return fuse.search(query).map((result) => result.item)
  }

  return {
    fuse,
    search,
  }
}
