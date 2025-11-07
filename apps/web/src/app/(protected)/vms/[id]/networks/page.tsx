'use client'

import { useVMContext } from '@/context/vm-context'
import { NetworksTable } from '@/features/vms/components/networks-table'
import { getNetworks } from '@/features/vms/utils/vms'

export default function VMNetworksPage() {
  const vm = useVMContext().vm
  const networks = getNetworks(vm)

  return <NetworksTable items={networks} />
}
