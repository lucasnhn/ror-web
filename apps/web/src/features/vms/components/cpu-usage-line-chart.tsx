'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/shadcn/chart'
import { cpuUsageHistory, CpuHistoryTimeRange, CPU_HISTORY_CONFIGS } from '../utils/cpu-usage-history'
import { useEffect, useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Activity, RotateCcw, Clock } from 'lucide-react'
import { cn } from '@/utils/clsxm'

interface CpuUsageLineChartProps {
  vmId: string
  currentCpuUsage?: number
  cpuSize?: number
  className?: string
  height?: number
}

const chartConfig = {
  cpuUsage: {
    label: 'CPU Usage (%)',
    color: '#0c8aca',
  },
}

const timeRangeLabels = {
  hourly: { label: 'Last Hour', icon: Clock },
  daily: { label: 'Last 24 Hours', icon: Clock },
  weekly: { label: 'Last 7 Days', icon: Clock },
}

export const CpuUsageLineChart = ({
  vmId,
  currentCpuUsage,
  cpuSize = 0,
  className,
  height = 400,
}: CpuUsageLineChartProps) => {
  const [timeRange, setTimeRange] = useState<CpuHistoryTimeRange>('daily')
  const [chartData, setChartData] = useState<ReturnType<typeof cpuUsageHistory.getChartData>>([])
  const [, setStats] = useState<ReturnType<typeof cpuUsageHistory.getStats>>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData = () => {
    setIsRefreshing(true)
    const data = cpuUsageHistory.getChartData(vmId, timeRange)
    const statistics = cpuUsageHistory.getStats(vmId, timeRange)
    setChartData(data)
    setStats(statistics)
    setTimeout(() => setIsRefreshing(false), 300)
  }

  useEffect(() => {
    refreshData()
  }, [vmId, timeRange])

  // Add current CPU usage whenever it changes
  useEffect(() => {
    if (currentCpuUsage !== undefined && currentCpuUsage !== null && vmId) {
      cpuUsageHistory.addCurrentReading(vmId, currentCpuUsage, timeRange)
      const data = cpuUsageHistory.getChartData(vmId, timeRange)
      const statistics = cpuUsageHistory.getStats(vmId, timeRange)
      setChartData(data)
      setStats(statistics)
    }
  }, [currentCpuUsage, vmId, timeRange])

  const clearHistory = () => {
    cpuUsageHistory.clearHistory(vmId)
    refreshData()
  }

  const formatTooltipLabel = (label: string, payload: Array<{ payload?: { timestamp: string } }>) => {
    if (payload && payload.length > 0 && payload[0].payload) {
      const dataPoint = payload[0].payload
      return `${new Date(dataPoint.timestamp).toLocaleString('en-GB', { timeZone: 'Europe/Oslo' })}`
    }
    return label
  }

  const hasData = chartData.length > 0

  return (
    <div className={cn('space-y-2 ', className)}>
      {/* Header with controls */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 mb-2'>
          <Activity className='h-4 w-4 text-blue-600' />
          <h3 className='text-lg font-medium'>CPU Usage</h3>
          {isRefreshing && (
            <div className='animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full' />
          )}
        </div>
        <div className='flex items-center gap-1'>
          <Button variant='outline' size='sm' onClick={refreshData} disabled={isRefreshing} className='h-7 px-2'>
            <RotateCcw className={cn('h-3 w-3', isRefreshing && 'animate-spin')} />
          </Button>
          <Button variant='outline' size='sm' onClick={clearHistory} className='h-7 px-2'>
            Clear
          </Button>
        </div>
      </div>

      {/* Time range selector */}
      <div className='flex gap-1 mb-5'>
        {(Object.keys(CPU_HISTORY_CONFIGS) as CpuHistoryTimeRange[]).map((range) => {
          const { label, icon: Icon } = timeRangeLabels[range]
          return (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size='sm'
              onClick={() => setTimeRange(range)}
              className='flex items-center gap-1 h-7 px-2 text-xs'
            >
              <Icon className='h-3 w-3' />
              {label}
            </Button>
          )
        })}
      </div>
      {/* Message to user about short lived data */}
      <p className='text-xs text-muted-foreground mt-1'>Data is temporarily stored in the browser web storage</p>

      {/* Chart */}
      {hasData ? (
        <ChartContainer config={chartConfig} className={`h-[${height}px] w-full`}>
          <ResponsiveContainer width='100%' height={height}>
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 15,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray='1 1' />
              <XAxis
                dataKey='formattedTime'
                tickLine={false}
                tickMargin={5}
                axisLine={false}
                fontSize={10}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                angle={timeRange === 'weekly' ? -45 : 0}
                textAnchor={timeRange === 'weekly' ? 'end' : 'middle'}
                height={timeRange === 'weekly' ? 40 : 30}
              />
              <YAxis
                tickLine={false}
                axisLine={true}
                fontSize={10}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                domain={[0, cpuSize]}
                width={30}
                label={{ value: 'CPU cores', angle: -90, position: 'insideLeft', offset: 0, fontSize: 10 }}
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`${value}`, ' cores']}
                    labelFormatter={formatTooltipLabel}
                  />
                }
              />

              {/* Critical usage reference lines */}
              <ReferenceLine y={80} stroke='#f59e0b' strokeDasharray='5 5' />
              <ReferenceLine y={90} stroke='#ef4444' strokeDasharray='5 5' />

              <Line
                type='monotone'
                dataKey='cpuUsage'
                stroke='var(--color-cpuUsage)'
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, stroke: 'var(--color-cpuUsage)', strokeWidth: 1 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      ) : (
        <div className='flex flex-col items-center justify-center h-32 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <Activity className='h-8 w-8 text-gray-400 mb-2' />
          <h4 className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>No CPU Usage History</h4>
          <p className='text-xs text-gray-500 text-center'>Data will appear once collected</p>
        </div>
      )}
    </div>
  )
}
