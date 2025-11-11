import { BackupJob, BackupRun, VirtualMachine } from '@ror/js-api-client'
import { getVmExternalId } from '@/features/vms/utils/vms'
import { getBackupJobActiveTargets } from '@/features/backup/utils/backup-job'
import { getBackupRunActiveTargets, getVMLastBackupInfo } from '@/features/backup/utils/backup-run'
import type { LastBackupInfo } from '@/features/backup/utils/backup-run'

export type VMWithBackupStatus = VirtualMachine & {
  backupStatus: {
    hasBackupJob: boolean
    hasBackupRun: boolean
    lastBackupInfo?: LastBackupInfo | null
  }
}

export function mapBackupToVM(
  vms: VirtualMachine[],
  backupJobs: BackupJob[],
  backupRuns: BackupRun[]
): VMWithBackupStatus[] {
  return vms.map((vm) => {
    const vmExternalId = getVmExternalId(vm)

    const relatedJobs = backupJobs.filter((job) => {
      const activeTargets = getBackupJobActiveTargets(job)
      return activeTargets.some((target) => target.externalId === vmExternalId)
    })

    const relatedRuns = backupRuns.filter((run) => {
      const activeTargets = getBackupRunActiveTargets(run)
      return activeTargets.some((target) => target.externalId === vmExternalId)
    })

    // Get last backup info - check both job-linked runs and standalone historical runs
    const lastBackupInfo = getVMLastBackupInfo(relatedJobs, backupRuns, relatedRuns)

    return {
      ...vm,
      backupStatus: {
        hasBackupJob: relatedJobs.length > 0,
        hasBackupRun: relatedRuns.length > 0,
        lastBackupInfo,
      },
    }
  })
}
