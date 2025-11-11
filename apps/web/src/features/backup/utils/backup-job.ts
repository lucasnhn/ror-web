import type { BackupJob } from '@ror/js-api-client'

export interface ActiveTargetSource {
  name?: string
  id?: string
  uuid?: string
  type?: string
}

export interface BackupActiveTarget {
  name?: string
  id?: string
  externalId?: string
  source: ActiveTargetSource | null
}

export const getBackupJobActiveTargets = (backupJob: BackupJob): BackupActiveTarget[] => {
  const activeTargets = backupJob?.backupjob?.status?.resourceBackupJobSpec?.activeTargets ?? []
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

export const getBackupJobExternalId = (backupActiveTarget: BackupActiveTarget) => {
  return backupActiveTarget?.externalId ?? 'No backupJob External ID'
}

export const getLastBackupRun = (backupJob: BackupJob) => {
  return backupJob?.backupjob?.status?.backupRunIds?.[0] ?? null
}
