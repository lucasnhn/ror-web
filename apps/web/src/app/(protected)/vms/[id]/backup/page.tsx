'use client'

import { useVMContext } from '@/context/vm-context'
import { useActiveBackupStatus, useBackupStatus } from '@/features/vms/backup/hooks/useBackupStatus'
import {
  BackupJobTable,
  BackupRunsTable,
  getLatestBackupRunId,
} from '@/features/vms/backup/components/backup-job-table'
import type { VMWithBackupStatus } from '@/features/vms/backup/utils/map-backup-to-vm'

export default function VMBackupPage() {
  const { vm } = useVMContext()
  const activeBackupStatus = useActiveBackupStatus(vm)
  const backupStatus = useBackupStatus(vm)

  // Check if VM is enhanced with backup status and has backup data arrays
  const enhancedVM = vm as VMWithBackupStatus
  const hasBackupDataArrays = 'backupStatus' in enhancedVM && enhancedVM.backupStatus?.relatedBackupJobs !== undefined

  const relatedBackupJobs = enhancedVM.backupStatus?.relatedBackupJobs || []
  const relatedBackupRuns = enhancedVM.backupStatus?.relatedBackupRuns || []

  return (
    <div>
      {hasBackupDataArrays ? (
        <div>
          {/* Show backup jobs table if there are backup jobs */}
          {relatedBackupJobs.length > 0 ? (
            <BackupJobTable items={relatedBackupJobs} backupRuns={relatedBackupRuns} />
          ) : relatedBackupRuns.length > 0 ? (
            /* Show standalone backup runs table if only runs exist */
            <div>
              <h3 className='text-lg font-semibold mb-4'>Historical Backup Runs</h3>
              <p className='text-sm text-gray-600 mb-4'>
                This VM has historical backup runs but no active backup jobs configured.
              </p>
              <BackupRunsTable backupRuns={relatedBackupRuns} latestRunId={getLatestBackupRunId(relatedBackupRuns)} />
            </div>
          ) : (
            <div className='p-4 bg-gray-50 border border-gray-200 rounded'>
              <p className='text-gray-600'>No backup jobs or runs found for this VM.</p>
            </div>
          )}
        </div>
      ) : (
        <div className='p-4 bg-yellow-50 border border-yellow-200 rounded'>
          <p className='text-yellow-800'>
            Backup data is not available for this VM. Please ensure the VM has been processed with backup information.
          </p>
        </div>
      )}
    </div>
  )
}
