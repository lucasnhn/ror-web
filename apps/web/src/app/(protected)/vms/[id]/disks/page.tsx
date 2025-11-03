'use client'

import { useVMContext } from '@/context/vm-context'
import { DisksTable } from '@/features/vms/components/disks-table'
import { getVmDisks } from '@/features/vms/utils/vms'

export default function VMDisksPage() {
  const { vm } = useVMContext()
  const disks = getVmDisks(vm)

  return <DisksTable items={disks} />
}
