import { useMemo } from 'react'
import Fuse from 'fuse.js'
import { VirtualMachine } from '../utils/vms'

interface UseVmSearchOptions {
  threshold?: number
  keys?: string[]
}

export const useVmSearch = (items: VirtualMachine[], options: UseVmSearchOptions = {}) => {
  const { threshold = 0.3, keys = ['label', 'hostname', 'powerState', 'family'] } = options

  const fuse = useMemo(() => {
    const flat = items.map((vm) => ({
      ...vm,
      label: vm.metadata?.name ?? vm.virtualmachine?.spec?.name,
      hostname: vm.virtualmachine?.status?.operatingsystem?.hostname,
      powerState: vm.virtualmachine?.status?.operatingsystem?.powerstate,
      family: vm.virtualmachine?.status?.operatingsystem?.family,
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
