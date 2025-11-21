' use client'

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
} from '@/features/vms/backup/utils/backup-job'
import Link from 'next/link'
import React from 'react'

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
          return schedules.map((schedule: any) => `${schedule.unit || ''}`).join(', ')
        },
      }
    ),
    columnHelper.accessor(
      (row) => {
        const activeTargets = getBackupJobActiveTargetsColumns(row)
        return activeTargets
      },
      {
        id: 'activeTargets',
        header: 'Active targets',
        enableSorting: false,
        cell: (info) => {
          const activeTargets = info.getValue()
          if (!activeTargets || activeTargets.length === 0) {
            return 'No active targets'
          }
          return `${activeTargets.length} target(s)`
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
