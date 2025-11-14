'use client'

import { ColumnDef } from '@tanstack/react-table'
import type { BackupJob } from '@ror/js-api-client'
import {
  getBackupJobStartTime,
  getBackupJobRetentionDisplay,
  getBackupJobAllRetentions,
  getBackupJobRetentionDuration,
  getBackupJobRetentionUnit,
} from '../utils/backup-job'
import { Pill } from '@/components/shadcn/pill'
import type { BackupRunInfo } from '../utils/backup-run'

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-GB', { timeZone: 'Europe/Oslo' })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', { timeZone: 'Europe/Oslo' })
}

export const BackupRunDetails = ({ backupRun }: { backupRun: BackupRunInfo }) => {
  // Calculate data transferred and compression ratio from size info
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const primaryDestination = backupRun.backupDestinations?.[0]

  return (
    <div className='border border-gray-300 dark:border-gray-600 p-4 rounded-lg space-y-3'>
      <h4 className='font-semibold text-gray-800 dark:text-gray-200'>Backup Run Details</h4>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {/* Size Information */}
        {backupRun.size?.sourceSize && (
          <div>
            <label className='text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300'>
              Source Size
            </label>
            <p className='text-sm text-gray-900 dark:text-gray-100'>{formatBytes(backupRun.size.sourceSize)}</p>
          </div>
        )}
        {backupRun.size?.logicalSize && (
          <div>
            <label className='text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300'>
              Logical Size
            </label>
            <p className='text-sm text-gray-900 dark:text-gray-100'>{formatBytes(backupRun.size.logicalSize)}</p>
          </div>
        )}

        {backupRun.size?.physicalSize && (
          <div>
            <label className='text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300'>
              Physical Size
            </label>
            <p className='text-sm text-gray-900 dark:text-gray-100'>{formatBytes(backupRun.size.physicalSize)}</p>
          </div>
        )}
      </div>

      {/* All Destinations */}
      <div className='border-t border-gray-300 dark:border-gray-600 pt-3'>
        <label className='text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300'>
          Backup Destinations
        </label>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-2'>
          {backupRun.backupDestinations && backupRun.backupDestinations.length > 0 ? (
            backupRun.backupDestinations.map((dest, index) => (
              <div key={index} className='relative p-2 rounded-lg border border-gray-300 dark:border-gray-600'>
                <div className='absolute top-2 right-2'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      dest.status === 'Succeeded'
                        ? 'text-green-800'
                        : dest.status === 'Failed'
                          ? 'text-red-800'
                          : dest.status === 'Running'
                            ? 'text-blue-800'
                            : 'text-gray-800'
                    }`}
                  >
                    {dest.status || 'Unknown'}
                  </span>
                </div>
                <div className='pr-20'>
                  <div className='text-sm font-medium text-gray-900 dark:text-gray-100'>{dest.name}</div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>Type: {dest.type}</div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>ID: {dest.id ? dest.id : 'N/A'}</div>
                </div>
              </div>
            ))
          ) : (
            <div className='p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'>
              <span className='text-sm text-gray-500 dark:text-gray-400'>No backup destinations configured</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const backupJobColumns: ColumnDef<BackupJob>[] = [
  {
    id: 'expander',
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <div className='inline-flex w-fit'>
          <button
            onClick={row.getToggleExpandedHandler()}
            className='text-black dark:text-white'
            aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
          >
            {row.getIsExpanded() ? '▼' : '▶'}
          </button>
        </div>
      ) : null,
  },
  {
    header: 'Backup Job ID',
    accessorFn: (row) => row.metadata?.name ?? 'N/A',
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    header: 'Start Time',
    accessorFn: (row) => getBackupJobStartTime(row),
    cell: ({ getValue }) => {
      const start = getValue() as string
      return <span>{start}</span>
    },
  },
  {
    header: 'Retention',
    cell: ({ row }) => {
      const retentionDuration = getBackupJobRetentionDuration(row.original)
      const retentionUnit = getBackupJobRetentionUnit(row.original)
      return <span>{`${retentionDuration} ${retentionUnit}`}</span>
    },
  },
]

export const backupRunsColumns = (latestRunId?: string | null): ColumnDef<BackupRunInfo>[] => [
  {
    id: 'expander',
    cell: ({ row }) => (
      <div className='inline-flex w-fit'>
        <button
          onClick={row.getToggleExpandedHandler()}
          className='text-black dark:text-white'
          aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
        >
          {row.getIsExpanded() ? '▼' : '▶'}
        </button>
      </div>
    ),
  },
  {
    header: 'Backup Run ID',
    accessorFn: (row) => row.id,
    cell: ({ getValue, row }) => {
      const runId = getValue() as string
      const isLatest = latestRunId && runId === latestRunId

      return (
        <div className={`font-mono text-sm ${isLatest ? 'font-semibold' : ''}`}>
          {isLatest && <Pill className='inline-block mr-2'> {'Latest'}</Pill>}
          {runId || 'N/A'}
        </div>
      )
    },
  },
  {
    header: 'Start Time',
    accessorFn: (row) => row.startTime,
    cell: ({ getValue, row }) => {
      const startTime = getValue() as string | null
      const runId = row.original.id
      const isLatest = latestRunId && runId === latestRunId

      if (!startTime) return <span className='text-gray-400'>N/A</span>

      const formattedDate = formatDate(startTime)
      const formattedTime = formatDateTime(startTime)

      return (
        <div>
          <div>{formattedDate}</div>
          <div className='text-xs '>{formattedTime}</div>
        </div>
      )
    },
  },
  {
    header: 'End Time',
    accessorFn: (row) => row.endTime,
    cell: ({ getValue, row }) => {
      const endTime = getValue() as string | null
      const runId = row.original.id
      const isLatest = latestRunId && runId === latestRunId

      if (!endTime) return <span className='text-gray-400'>N/A</span>

      const formattedDate = formatDate(endTime)
      const formattedTime = formatDateTime(endTime)

      return (
        <div>
          <div>{formattedDate}</div>
          <div className='text-xs '>{formattedTime}</div>
        </div>
      )
    },
  },
  {
    header: 'Expiry Time',
    accessorFn: (row) => row.expiryTime,
    cell: ({ getValue, row }) => {
      const expiryTime = getValue() as string | null
      const runId = row.original.id
      const isLatest = latestRunId && runId === latestRunId

      if (!expiryTime) return <span className='text-gray-400'>N/A</span>

      const formattedDate = formatDate(expiryTime)
      const formattedTime = formatDateTime(expiryTime)
      const isExpired = new Date(expiryTime) < new Date()

      return (
        <div>
          <div>{formattedDate}</div>
          <div className='text-xs '>{formattedTime}</div>
          {isExpired && <span className='text-xs text-red-500 font-medium'>Expired</span>}
        </div>
      )
    },
  },
  {
    header: 'Status',
    accessorFn: (row) => row.backupDestinations?.[0]?.status,
    cell: ({ getValue, row }) => {
      const status = getValue() as string | null
      const runId = row.original.id
      const isLatest = latestRunId && runId === latestRunId

      if (!status) return <span className='text-gray-400'>N/A</span>

      return (
        <span
          className={`text-sm font-medium ${
            status === 'Succeeded'
              ? ' text-green-700'
              : status === 'Failed'
                ? 'text-red-700'
                : status === 'Running'
                  ? ' text-blue-700'
                  : ' text-gray-800'
          }`}
        >
          {status}
        </span>
      )
    },
  },
  {
    header: 'Duration',
    accessorFn: (row) => ({ start: row.startTime, end: row.endTime }),
    cell: ({ getValue, row }) => {
      const { start, end } = getValue() as { start: string | null; end: string | null }
      const runId = row.original.id
      const isLatest = latestRunId && runId === latestRunId

      if (!start || !end) return <span className='text-gray-400'>N/A</span>

      const startDate = new Date(start)
      const endDate = new Date(end)
      const durationMs = endDate.getTime() - startDate.getTime()

      const hours = Math.floor(durationMs / (1000 * 60 * 60))
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((durationMs % (1000 * 60)) / 1000)

      let durationText = ''
      if (hours > 0) durationText += `${hours}h `
      if (minutes > 0) durationText += `${minutes}m `
      if (seconds > 0 || durationText === '') durationText += `${seconds}s`

      return <span>{durationText.trim()}</span>
    },
  },
]
