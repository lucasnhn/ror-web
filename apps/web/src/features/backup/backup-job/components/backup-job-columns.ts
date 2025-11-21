'use client'

import { BackupJob } from '@ror/js-api-client'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTableColumnDef } from '@/components/ui/data-table'
import {
  getBackupJobId,
  getBackupJobSource,
  getBackupJobLocation,
  getBackupJobSchedules,
  getBackupJobActiveTargetsColumns,
  getBackupJobAllRunIds,
  getBackupJobActiveTargets,
} from '@/features/vms/backup/utils/backup-job'
import Link from 'next/link'
import React from 'react'

interface ExpandableTargetsProps {
  targets: Array<{ name?: string }>
  count: number
}

const ExpandableTargets: React.FC<ExpandableTargetsProps> = ({ targets, count }) => {
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
      ...targets.map((target, index) =>
        React.createElement(
          'div',
          {
            key: index,
            className: 'text-xs p-1 text-gray-700 dark:text-gray-300',
          },
          target?.name || `Unnamed target ${index + 1}`
        )
      )
    )
  )
}

const columnHelper = createColumnHelper<BackupJob>()

export const getBackupJobTableColumns = (): DataTableColumnDef<BackupJob>[] => {
  return [
    columnHelper.accessor(
      (row) => {
        const backupJobId = getBackupJobId(row)
        return backupJobId
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
        const source = getBackupJobSource(row)
        return source
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
        const location = getBackupJobLocation(row)
        return location
      },
      {
        id: 'location',
        header: 'Location',
        enableSorting: true,
        sortingFn: 'text',
        cell: (info) => {
          const location = info.getValue()
          return location
        },
      }
    ),
    columnHelper.accessor(
      (row) => {
        const schedules = getBackupJobSchedules(row)
        return schedules
      },
      {
        id: 'schedules',
        header: 'Schedules',
        enableSorting: false,
        cell: (info) => {
          const schedules = info.getValue()
          if (!schedules || schedules.length === 0) {
            return 'No schedules'
          }
          return schedules.map((schedule) => `${schedule.unit || ''}`).join(', ')
        },
      }
    ),
    columnHelper.accessor(
      (row) => {
        const activeTargets = getBackupJobActiveTargets(row)
        return activeTargets
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

          // For multiple targets, create a compact expandable view
          return React.createElement(
            'div',
            {
              className: 'max-w-xs',
            },
            React.createElement(ExpandableTargets, {
              targets: activeTargets,
              count: targetCount,
            })
          )
        },
      }
    ),
    columnHelper.accessor(
      (row) => {
        const backupRunIds = getBackupJobAllRunIds(row)
        return backupRunIds
      },
      {
        id: 'backupRunIds',
        header: 'Backup run IDs',
        enableSorting: false,
        cell: (info) => {
          const backupRunIds = info.getValue()
          if (!backupRunIds || backupRunIds.length === 0) {
            return 'No backup runs'
          }
          const backupJobId = getBackupJobId(info.row.original)

          return React.createElement(
            Link,
            {
              href: `/backup/backup-runs?backupJobId=${backupJobId}`,
              className: 'text-blue-600 hover:underline',
            },
            `${backupRunIds.length} runs`
          )
        },
      }
    ),
  ].filter(Boolean) as DataTableColumnDef<BackupJob>[]
}
