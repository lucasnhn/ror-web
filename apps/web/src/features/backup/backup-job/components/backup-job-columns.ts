'use client'

import { BackupJob, BackupRun } from '@ror/js-api-client'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTableColumnDef } from '@/components/ui/data-table'
import {
  getBackupJobId,
  getBackupJobSource,
  getBackupJobLocation,
  getBackupJobSchedules,
  getBackupJobAllRunIds,
  getBackupJobActiveTargets,
  BackupActiveTarget,
} from '@/features/vms/backup/utils/backup-job'
import { getBackupRunId } from '@/features/vms/backup/utils/backup-run'
import Link from 'next/link'
import React from 'react'
import { ActiveTargetsTooltip, IdListTooltip } from '../../utils/active-targets-tooltip'

const columnHelper = createColumnHelper<BackupJob>()

export const getBackupJobTableColumns = (backupRuns?: BackupRun[]): DataTableColumnDef<BackupJob>[] => {
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
          return React.createElement(ActiveTargetsTooltip, {
            ids: activeTargets.map((t: BackupActiveTarget) => ({
              id: t.name || 'Unnamed target',
              //href: routes.app.vmBackup.getHref(t.name?.toLowerCase()),
            })),
          })
        },
      }
    ),
    columnHelper.accessor(
      (row) => {
        const backupRunIds = getBackupJobAllRunIds(row)
        //return backupRunIds
        const existingBackupRunIds = backupRuns?.map((run) => getBackupRunId(run)) || []
        const filteredIds = backupRunIds.filter((id) => existingBackupRunIds.includes(id))

        return filteredIds
      },
      {
        id: 'backupRunIds',
        header: 'Backup run IDs',
        enableSorting: false,
        cell: (info) => {
          const filteredIds = info.getValue()
          if (!filteredIds || filteredIds.length === 0) {
            return 'No backup runs'
          }
          const backupJobId = getBackupJobId(info.row.original)
          return React.createElement(IdListTooltip, {
            ids: filteredIds,
            label: 'Backup Run IDs',
            triggerElement: React.createElement(
              Link,
              {
                href: `/vms/backup/backup-runs?backupJobId=${backupJobId}`,
                className: 'text-blue-600 hover:underline',
              },
              `${filteredIds.length} backup runs`
            ),
          })
        },
      }
    ),
  ].filter(Boolean) as DataTableColumnDef<BackupJob>[]
}
