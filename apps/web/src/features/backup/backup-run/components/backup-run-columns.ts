'use client'

import { DataTableColumnDef } from '@/components/ui/data-table'
import {
  getBackupRunActiveTargets,
  getBackupRunEndTime,
  getBackupRunExpiryTime,
  getBackupRunId,
  getBackupRunMappedBackupJobId,
  getBackupRunSource,
  getBackupRunStartTime,
} from '@/features/vms/backup/utils/backup-run'
import { BackupRun } from '@ror/js-api-client'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'

interface ExpandableTargetsProps {
  targets: Array<{ name?: string }>
}
const ExpandableTargets: React.FC<ExpandableTargetsProps> = ({ targets }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  if (!isExpanded) {
    return React.createElement(
      'div',
      {
        className: 'flex items-center space-x-2',
      },
      React.createElement(
        'span',
        {
          className: 'truncate',
        },
        targets.length + ' targets '
      ),
      React.createElement(
        'div',
        {
          className:
            'text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300 font-medium transition-colors',
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation()
            setIsExpanded(true)
          },
        },
        `+Show`
      )
    )
  }

  return React.createElement(
    'div',
    {
      className: 'space-y-1',
    },
    React.createElement(
      'button',
      {
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation()
          setIsExpanded(false)
        },
        className: 'text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium',
      },
      '← Show less'
    ),
    React.createElement(
      'div',
      {
        className: 'max-h-32 overflow-y-auto space-y-1',
      },
      targets.map((target, index) => {
        return React.createElement(
          'div',
          {
            key: index,
            className: 'text-xs p-1 text-gray-700 dark:text-gray-300',
          },
          target?.name || `Unnamed target ${index + 1}`
        )
      })
    )
  )
}

const columnHelper = createColumnHelper<BackupRun>()

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-GB', { timeZone: 'Europe/Oslo' })
}

export const getBackupRunTableColumns = (): DataTableColumnDef<BackupRun>[] => {
  return [
    columnHelper.accessor(
      (row) => {
        const backupRunId = getBackupRunId(row)
        return backupRunId
      },
      {
        id: 'id',
        header: 'ID',
        enableSorting: true,
        sortingFn: 'text',
        cell: (info) => {
          const id = info.getValue()
          return React.createElement(
            'div',
            {
              className: 'min-w-0 break-words font-mono text-sm',
            },
            id
          )
        },
      }
    ),
    columnHelper.accessor(
      (row) => {
        const backupRunSource = getBackupRunSource(row)
        return backupRunSource
      },
      {
        id: 'source',
        header: 'Source',
        enableSorting: true,
        sortingFn: 'text',
        cell: (info) => {
          const source = info.getValue()
          return source
        },
      }
    ),
    columnHelper.accessor(
      (row) => {
        const backupRunStartTime = getBackupRunStartTime(row)
        return backupRunStartTime
      },
      {
        id: 'startTime',
        header: 'Start time',
        enableSorting: true,
        sortingFn: 'text',
        cell: (info) => {
          const startTime = info.getValue()
          return formatDateTime(startTime)
        },
      }
    ),
    columnHelper.accessor(
      (row) => {
        const backupRunEndTime = getBackupRunEndTime(row)
        return backupRunEndTime
      },
      {
        id: 'endTime',
        header: 'End time',
        enableSorting: true,
        sortingFn: 'text',
        cell: (info) => {
          const endTime = info.getValue()
          return formatDateTime(endTime)
        },
      }
    ),
    columnHelper.accessor(
      (row) => {
        const backupRunExpiryTime = getBackupRunExpiryTime(row)
        return backupRunExpiryTime
      },
      {
        id: 'expiryTime',
        header: 'Expiry time',
        enableSorting: true,
        sortingFn: 'text',
        cell: (info) => {
          const expiryTime = info.getValue()
          return formatDateTime(expiryTime)
        },
      }
    ),
    columnHelper.accessor(
      (row) => {
        const backupRunActiveTargets = getBackupRunActiveTargets(row)
        return backupRunActiveTargets
      },
      {
        id: 'activeTargets',
        header: 'Active targets',
        enableSorting: false,
        cell: (info) => {
          const activeTargets = info.getValue()
          const targetCount = activeTargets.length

          if (!activeTargets || targetCount === 0) {
            return 'No active targets'
          }
          return React.createElement(
            'div',
            {
              className: 'max-w-xs',
            },
            React.createElement(ExpandableTargets, {
              targets: activeTargets,
            })
          )
        },
      }
    ),
    columnHelper.accessor(
      (row) => {
        const backupRunMappedBackupJobId = getBackupRunMappedBackupJobId(row)
        return backupRunMappedBackupJobId
      },
      {
        id: 'backupJobId',
        header: 'Backup job ID',
        enableSorting: true,
        sortingFn: 'text',
        cell: (info) => {
          const backupJobId = info.getValue()
          return React.createElement(
            'div',
            {
              className: 'min-w-0 break-words font-mono text-sm',
            },
            backupJobId
          )
        },
      }
    ),
  ].filter(Boolean) as DataTableColumnDef<BackupRun>[]
}
