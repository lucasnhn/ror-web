'use client'

import { useVMContext } from '@/context/vm-context'
import { getStatusCpuUsage, getSpecCpuTotal } from '../utils/vms'
import { CpuUsageLineChart } from './cpu-usage-line-chart'
import { Card, CardContent } from '@/components/shadcn/card'

export const DetailedCPUUsage = () => {
  const { vm } = useVMContext()
  const currentCpuUsage = getStatusCpuUsage(vm)
  const vmId = vm.metadata?.uid || 'unknown'

  if (!vm) {
    return (
      <Card>
        <CardContent>
          <div className='text-center text-gray-500 py-8'>No VM data available</div>
        </CardContent>
      </Card>
    )
  }

  const cpuSize = getSpecCpuTotal(vm)

  return (
    <div className='space-y-6'>
      {/* Historical Chart */}
      <Card>
        <CardContent className='p-4 pt-0'>
          <CpuUsageLineChart vmId={vmId} currentCpuUsage={currentCpuUsage} cpuSize={cpuSize} height={200} />
        </CardContent>
      </Card>
    </div>
  )
}
