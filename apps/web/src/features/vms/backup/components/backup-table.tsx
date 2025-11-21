'use client'

import { DataTable } from '@/components/ui/data-table'
import type { BackupJob, BackupRun } from '@ror/js-api-client'
import { backupJobColumns, backupRunsColumns, BackupRunDetails } from './backup-columns'
import type { BackupRunInfo } from '../utils/backup-run'
import { TableRow, TableCell } from '@ror/react/components/table/table'
import { getBackupJobAllRunIds, getLastBackupRun } from '../utils/backup-job'
import { getBackupRunsInfoFromIds, getBackupRunInfo } from '../utils/backup-run'

interface BackupJobTableProps {
  items: BackupJob[]
  backupRuns: BackupRun[]
}

export const convertBackupRunsToInfo = (backupRuns: BackupRun[]): BackupRunInfo[] => {
  return backupRuns
    .map((run) => getBackupRunInfo(run))
    .filter((info): info is BackupRunInfo => info.id !== null) as BackupRunInfo[]
}

export const getLatestBackupRunId = (backupRuns: BackupRun[]): string | null => {
  if (backupRuns.length === 0) return null

  let latestRun = backupRuns[0]
  let latestDate = new Date(latestRun?.backuprun?.status?.startTime || 0)

  for (const run of backupRuns) {
    const startTime = run?.backuprun?.status?.startTime
    if (startTime) {
      const runDate = new Date(startTime)
      if (runDate > latestDate) {
        latestDate = runDate
        latestRun = run
      }
    }
  }

  return latestRun?.backuprun?.id ?? null
}

interface BackupRunsTableProps {
  backupRuns: BackupRun[]
  latestRunId?: string | null
}

export const BackupRunsTable = ({ backupRuns, latestRunId }: BackupRunsTableProps) => {
  const runInfos = convertBackupRunsToInfo(backupRuns)

  return (
    <DataTable<BackupRunInfo>
      columns={backupRunsColumns(latestRunId)}
      data={runInfos}
      expandable
      renderExpandedRow={(row) => {
        const backupRunInfo = row.original

        return (
          <TableRow className='contents'>
            <TableCell colSpan={backupRunsColumns(latestRunId).length} className='p-0' style={{ gridColumn: '1 / -1' }}>
              <div className='w-full bg-[var(--r-layer-1)] brightness-110 dark:brightness-140 px-4 py-4'>
                <BackupRunDetails backupRun={backupRunInfo} />
              </div>
            </TableCell>
          </TableRow>
        )
      }}
    />
  )
}

export const BackupJobTable = ({ items, backupRuns }: BackupJobTableProps) => (
  <DataTable<BackupJob>
    columns={backupJobColumns}
    expandable
    data={items}
    renderExpandedRow={(row) => {
      const backupJob = row.original
      const latestRunId = getLastBackupRun(backupJob) // Gets the latest run ID
      const allRunIds = getBackupJobAllRunIds(backupJob) // Gets all run IDs
      const runInfos = getBackupRunsInfoFromIds(allRunIds, backupRuns) // Convert to table data

      return (
        <TableRow className='contents'>
          <TableCell colSpan={backupJobColumns.length + 1} className='p-0' style={{ gridColumn: '1 / -1' }}>
            <div className='w-full bg-[var(--r-layer-1)] brightness-110 dark:brightness-140 px-4 py-4'>
              <div className='overflow-auto'>
                <div className='inline-block min-w-full align-middle'></div>
                <DataTable<BackupRunInfo>
                  columns={backupRunsColumns(latestRunId)}
                  data={runInfos.filter((runs): runs is BackupRunInfo => runs !== null) as BackupRunInfo[]}
                  expandable
                  renderExpandedRow={(nestedRow) => {
                    const nestedBackupRunInfo = nestedRow.original

                    return (
                      <TableRow className='contents'>
                        <TableCell
                          colSpan={backupRunsColumns(latestRunId).length}
                          className='p-0'
                          style={{ gridColumn: '1 / -1' }}
                        >
                          <div className='w-full bg-[var(--r-layer-2)] brightness-105 dark:brightness-90 px-4 py-4'>
                            <BackupRunDetails backupRun={nestedBackupRunInfo} />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  }}
                />
              </div>
            </div>
          </TableCell>
        </TableRow>
      )
    }}
  />
)
