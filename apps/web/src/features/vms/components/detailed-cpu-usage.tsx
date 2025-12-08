'use client'

import { useVMContext } from '@/context/vm-context'
import { getStatusCpuUsage, getSpecCpuTotal } from '../utils/vms'
import { CpuUsageLineChart } from './cpu-usage-line-chart'
import { useCpuHistoryCollector } from '../hooks/use-cpu-history-collector'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn/card'

export const DetailedCPUUsage = () => {
  const { vm } = useVMContext()
  const currentCpuUsage = getStatusCpuUsage(vm)
  const vmId = vm.metadata?.uid || 'unknown'

  // Automatically collect CPU usage history
  const { getStats } = useCpuHistoryCollector({
    vmId,
    currentCpuUsage,
    timeRange: 'daily',
    collectInterval: 30000, // Collect every 30 seconds
    enabled: true,
  })

  if (!vm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>CPU Usage History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center text-gray-500 py-8'>No VM data available</div>
        </CardContent>
      </Card>
    )
  }

  const stats = getStats()
  const cpuSize = getSpecCpuTotal(vm)

  return (
    <div className='space-y-6'>
      {/* Current CPU Usage Summary */}

      {/* Historical Chart */}
      <Card>
        <CardContent className='p-6'>
          <CpuUsageLineChart vmId={vmId} currentCpuUsage={currentCpuUsage} cpuSize={cpuSize} height={200} />
        </CardContent>
      </Card>
    </div>
  )
}
