'use client'

import { useVMContext } from '@/context/vm-context'
import { DisksTable } from '@/features/vms/components/disks-table'
import { getVmDisks } from '@/features/vms/utils/vms'
import { DiskCharts } from '@/features/vms/components/disk-charts'

export default function VMDisksPage() {
  const { vm } = useVMContext()
  const disks = getVmDisks(vm)

  return (
    <>
      <DisksTable items={disks} />
      <div className='mt-8 space-y-6'>
        <DiskCharts items={disks} />
      </div>
    </>
  )
}
