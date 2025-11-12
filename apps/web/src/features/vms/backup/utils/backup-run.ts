import type { BackupRun, BackupJob } from '@ror/js-api-client'
import { BackupActiveTarget } from '@/features/vms/backup/utils/backup-job'
import { getLastBackupRun } from '@/features/vms/backup/utils/backup-job'

export interface LastBackupInfo {
  startTime: string | null
  endTime: string | null
  expiryTime: string | null
}

export const getBackupRunActiveTargets = (backupRun: BackupRun): BackupActiveTarget[] => {
  const activeTargets = backupRun?.backuprun?.status?.backupTargets ?? []
  return activeTargets.map((target) => ({
    name: target?.name ?? '',
    id: target?.id ?? '',
    externalId: target?.externalId ?? '',
    source: {
      name: target?.source?.name ?? '',
      id: target?.source?.id ?? '',
      uuid: target?.source?.uuid ?? '',
      type: target?.source?.type ?? '',
    },
  }))
}

export const getBackupRunExternalId = (backupActiveTarget: BackupActiveTarget) => {
  return backupActiveTarget?.externalId ?? 'No backupRun External ID'
}

export const getBackupRunInfo = (backupRun: BackupRun) => {
  return {
    id: backupRun?.backuprun?.id ?? null,
    startTime: backupRun?.backuprun?.status?.startTime ?? null,
    endTime: backupRun?.backuprun?.status?.endTime ?? null,
    expiryTime: backupRun?.backuprun?.status?.expiryTime ?? null,
    status: backupRun?.backuprun?.status?.backupDestinations?.[0]?.status ?? null,
  }
}

/**
 * Finds the last backup run info for a given backup job
 * @param backupJob - The backup job to get the last run ID from
 * @param backupRuns - Array of all backup runs to search through
 * @returns Last backup run info or null if not found
 */
export const getLastBackupRunInfoFromJob = (backupJob: BackupJob, backupRuns: BackupRun[]) => {
  const lastBackupRunId = getLastBackupRun(backupJob)

  if (!lastBackupRunId) {
    return null
  }

  // Find the backup run that matches the ID
  const matchingBackupRun = backupRuns.find((run) => run?.backuprun?.id === lastBackupRunId)

  if (!matchingBackupRun) {
    return null
  }

  return getBackupRunInfo(matchingBackupRun)
}

/**
 * Gets the most recent backup run info for a VM from related backup jobs and runs
 * @param relatedBackupJobs - Backup jobs that target this VM
 * @param backupRuns - Array of all backup runs
 * @param relatedBackupRuns - Backup runs that directly target this VM (for historical runs)
 * @returns Most recent backup run info or null
 */
export const getVMLastBackupInfo = (
  relatedBackupJobs: BackupJob[],
  backupRuns: BackupRun[],
  relatedBackupRuns?: BackupRun[]
) => {
  let latestBackupInfo = null
  let latestDate = null

  // First, check backup runs from active backup jobs
  for (const job of relatedBackupJobs) {
    const backupInfo = getLastBackupRunInfoFromJob(job, backupRuns)

    if (backupInfo?.startTime) {
      const backupDate = new Date(backupInfo.startTime)

      if (!latestDate || backupDate > latestDate) {
        latestDate = backupDate
        latestBackupInfo = backupInfo
      }
    }
  }

  // If no backup info from jobs, check historical backup runs directly
  if (!latestBackupInfo && relatedBackupRuns) {
    for (const run of relatedBackupRuns) {
      const backupInfo = getBackupRunInfo(run)

      if (backupInfo?.startTime) {
        const backupDate = new Date(backupInfo.startTime)

        if (!latestDate || backupDate > latestDate) {
          latestDate = backupDate
          latestBackupInfo = backupInfo
        }
      }
    }
  }

  return latestBackupInfo
}
