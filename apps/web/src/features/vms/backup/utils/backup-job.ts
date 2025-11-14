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

export const getBackupJobStartTime = (backupJob: BackupJob) => {
  return backupJob?.backupjob?.status?.resourceBackupJobSpec?.schedules?.[0]?.startTime ?? 'No start time'
}

export const getBackupJobRetentionDuration = (backupJob: BackupJob) => {
  return backupJob?.backupjob?.status?.resourceBackupJobSpec?.schedules?.[0]?.retention?.duration ?? 'No retention time'
}

export const getBackupJobRetentionUnit = (backupJob: BackupJob) => {
  return backupJob?.backupjob?.status?.resourceBackupJobSpec?.schedules?.[0]?.retention?.unit ?? 'No retention unit'
}

// Get all retention settings from all schedules
export const getBackupJobAllRetentions = (backupJob: BackupJob) => {
  const schedules = backupJob?.backupjob?.status?.resourceBackupJobSpec?.schedules ?? []
  return schedules.map((schedule, index) => ({
    scheduleIndex: index,
    duration: schedule?.retention?.duration ?? 'No duration',
    unit: schedule?.retention?.unit ?? 'No unit',
    destination: schedule?.destination?.name ?? 'Unknown destination',
  }))
}

// Get formatted retention string for display
export const getBackupJobRetentionDisplay = (backupJob: BackupJob) => {
  const retentions = getBackupJobAllRetentions(backupJob)
  if (retentions.length === 0) return 'No retention configured'

  return retentions.map((ret) => `${ret.duration} ${ret.unit} (${ret.destination})`).join(', ')
}

// Get all backup run IDs for a backup job
export const getBackupJobAllRunIds = (backupJob: BackupJob): string[] => {
  return backupJob?.backupjob?.status?.backupRunIds ?? []
}
