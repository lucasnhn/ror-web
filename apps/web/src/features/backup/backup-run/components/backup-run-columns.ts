'use client'

import { DataTableColumnDef } from '@/components/ui/data-table'
import {
  getBackupRunActiveTargetsColumns,
  getBackupRunEndTime,
  getBackupRunExpiryTime,
  getBackupRunId,
  getBackupRunMappedBackupJobId,
  getBackupRunSource,
  getBackupRunStartTime,
} from '@/features/vms/backup/utils/backup-run'
import { BackupRun } from '@ror/js-api-client'
import { createColumnHelper } from '@tanstack/react-table'
import { BackupRunColumnsData } from '../types/backup-run-types'
import React from 'react'

const columnHelper = createColumnHelper<BackupRun>()

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-GB', { timeZone: 'Europe/Oslo' })
}

export const getBackupRunTableColumns = (
  selectedDisplayData?: BackupRunColumnsData[]
): DataTableColumnDef<BackupRun>[] => {
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
        size: 250, // Set minimum width for long IDs
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
        const backupRunActiveTargets = getBackupRunActiveTargetsColumns(row)
        return backupRunActiveTargets
      },
      {
        id: 'activeTargets',
        header: 'Active Targets',
        enableSorting: false,
        cell: (info) => {
          const activeTargets = info.getValue()
          if (!activeTargets || activeTargets.length === 0) {
            return 'No active targets'
          }
          // Convert active targets array to a readable string
          return `${activeTargets.length} target(s)`
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
        header: 'Start Time',
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
        header: 'End Time',
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
        header: 'Expiry Time',
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
        const backupRunMappedBackupJobId = getBackupRunMappedBackupJobId(row)
        return backupRunMappedBackupJobId
      },
      {
        id: 'backupJobId',
        header: 'Backup Job ID',
        enableSorting: true,
        sortingFn: 'text',
        size: 300, // Set minimum width for this column
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
