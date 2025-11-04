'use client'

import { VirtualMachineDisks } from '@ror/js-api-client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'

export const DiskCharts = ({ items }: { items: VirtualMachineDisks[] }) => {
  const chartData = items.map((disk) => {
    const size = disk.sizeBytes ? Number(disk.sizeBytes) / 1024 ** 3 : 0
    const usage = disk.usageBytes ? Number(disk.usageBytes) / 1024 ** 3 : 0
    const name = disk.name || disk.id || 'Unknown Disk'

    return {
      name,
      'Size (GB)': Number(size.toFixed(2)),
      'Usage (GB)': Number(usage.toFixed(2)),
      'Free (GB)': Number((size - usage).toFixed(2)),
    }
  })

  // Check for disks with less than 20% available space
  const lowSpaceDisks = items
    .filter((disk) => {
      const size = disk.sizeBytes ? Number(disk.sizeBytes) / 1024 ** 3 : 0
      const usage = disk.usageBytes ? Number(disk.usageBytes) / 1024 ** 3 : 0
      const percentUsed = size > 0 ? (usage / size) * 100 : 0
      return percentUsed > 80 && percentUsed <= 95
    })
    .map((disk) => {
      const size = disk.sizeBytes ? Number(disk.sizeBytes) / 1024 ** 3 : 0
      const usage = disk.usageBytes ? Number(disk.usageBytes) / 1024 ** 3 : 0
      const percentUsed = size > 0 ? (usage / size) * 100 : 0
      const name = disk.name || disk.id || 'Unknown Disk'
      return { name, percentUsed }
    })

  // Check for disks with less than 5% available space (critical)
  const criticalSpaceDisks = items
    .filter((disk) => {
      const size = disk.sizeBytes ? Number(disk.sizeBytes) / 1024 ** 3 : 0
      const usage = disk.usageBytes ? Number(disk.usageBytes) / 1024 ** 3 : 0
      const percentUsed = size > 0 ? (usage / size) * 100 : 0
      return percentUsed > 95
    })
    .map((disk) => {
      const size = disk.sizeBytes ? Number(disk.sizeBytes) / 1024 ** 3 : 0
      const usage = disk.usageBytes ? Number(disk.usageBytes) / 1024 ** 3 : 0
      const percentUsed = size > 0 ? (usage / size) * 100 : 0
      const freeSpace = size - usage
      const name = disk.name || disk.id || 'Unknown Disk'
      return { name, percentUsed, freeSpace }
    })

  return (
    <div className='border border-border rounded-lg p-4 bg-background'>
      <h3 className='text-lg font-semibold mb-4'>All Disks Usage</h3>

      {/* Critical Disk Space Warning (less than 5% free) */}
      {criticalSpaceDisks.length > 0 && (
        <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
          <div className='flex items-start gap-2'>
            <AlertCircle className='h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0' />
            <div>
              <h4 className='font-semibold text-red-800 dark:text-red-200 text-sm'>Critical Disk Space Warning</h4>
              <p className='text-red-700 dark:text-red-300 text-xs mt-1'>
                The following disk{criticalSpaceDisks.length > 1 ? 's have' : ' has'} less than 5% free space remaining:
              </p>
              <ul className='mt-2 space-y-1'>
                {criticalSpaceDisks.map((disk, index) => (
                  <li key={index} className='text-red-700 dark:text-red-300 text-xs'>
                    • <strong>{disk.name}</strong>: {disk.percentUsed.toFixed(1)}% used ({disk.freeSpace.toFixed(1)} GB
                    free)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Low Disk Space Warning */}
      {lowSpaceDisks.length > 0 && (
        <div className='mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
          <div className='flex items-start gap-2'>
            <AlertTriangle className='h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0' />
            <div>
              <h4 className='font-semibold text-yellow-800 dark:text-yellow-200 text-sm'>Low Disk Space Warning</h4>
              <p className='text-yellow-700 dark:text-yellow-300 text-xs mt-1'>
                The following disk{lowSpaceDisks.length > 1 ? 's have' : ' has'} more than 80% used:
              </p>
              <ul className='mt-2 space-y-1'>
                {lowSpaceDisks.map((disk, index) => (
                  <li key={index} className='text-yellow-700 dark:text-yellow-300 text-xs'>
                    • <strong>{disk.name}</strong>: {disk.percentUsed.toFixed(1)}% used
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* All Clear Status - when no warnings */}
      {criticalSpaceDisks.length === 0 && lowSpaceDisks.length === 0 && items.length > 0 && (
        <div className='mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
          <div className='flex items-start gap-2'>
            <CheckCircle className='h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0' />
            <div>
              <h4 className='font-semibold text-green-800 dark:text-green-200 text-sm'>Disk Space Status: Healthy</h4>
              <p className='text-green-700 dark:text-green-300 text-xs mt-1'>
                All disks have sufficient free space (less than 80% used). No action required.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className='w-full h-96'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey='name' />
            <YAxis tickLine={false} tickMargin={10} axisLine={true} />
            <Tooltip
              formatter={(value) => [`${value} GB`, '']}
              labelFormatter={(label) => `Disk: ${label}`}
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--foreground)',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend />
            <Bar dataKey='Size (GB)' fill='#23588da2' name='Total Size' />
            <Bar dataKey='Usage (GB)' fill='#e46139ff' name='Used Space' />
            <Bar dataKey='Free (GB)' fill='#82ca9eff' name='Free Space' />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className='mt-4 text-sm text-muted-foreground'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
          {items.map((disk, index) => {
            const size = disk.sizeBytes ? Number(disk.sizeBytes) / 1024 ** 3 : 0
            const usage = disk.usageBytes ? Number(disk.usageBytes) / 1024 ** 3 : 0
            const name = disk.name || disk.id || `Disk ${index + 1}`
            return (
              <div key={disk.id || index} className='text-xs'>
                <strong>{name}:</strong> {usage.toFixed(1)} / {size.toFixed(1)} GB (
                {size > 0 ? ((usage / size) * 100).toFixed(1) : 0}% used)
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
