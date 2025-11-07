import { useMemo } from 'react'
import Fuse from 'fuse.js'
import type { VirtualMachine } from '@ror/js-api-client'
import { getVmFamily, getVmHostName, getVmPowerState } from '../utils/vms'

export const useVmSearch = (items: VirtualMachine[], query: string) => {
  const fuse = useMemo(() => {
    const flat = items.map((vm) => ({
      ...vm,
      label: getVmHostName(vm),
      powerState: getVmPowerState(vm),
      family: getVmFamily(vm),
    }))

    return new Fuse(flat, {
      keys: ['label', 'powerState', 'family'],
      threshold: 0.3,
    })
  }, [items])

  return query ? fuse.search(query).map((r) => r.item) : items
}
