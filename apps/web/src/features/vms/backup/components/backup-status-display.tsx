/**
 * Backup Status Display Components
 *
 * This file contains components and logic for displaying backup status information
 * in VM cards and other UI elements. It handles the visual representation of
 * active, historical, and missing backup states.
 */

import { cn } from '@/utils/clsxm'
import { useActiveBackupStatus, useBackupStatus } from '@/features/vms/backup/hooks/useBackupStatus'
import type { VirtualMachine } from '@ror/js-api-client'
import type { VMWithBackupStatus } from '@/features/vms/backup/utils/map-backup-to-vm'

type VMTableRow = VirtualMachine | VMWithBackupStatus

interface BackupStatusDisplayProps {
  vm: VMTableRow
  className?: string
}

interface BackupInfoItemProps {
  icon: 'started' | 'ended' | 'expires'
  label: string
  value: string
}

const BackupInfoItem = ({ icon, label, value }: BackupInfoItemProps) => {
  const iconColors = {
    started: 'bg-green-400',
    ended: 'bg-blue-400',
    expires: 'bg-orange-400',
  }

  return (
    <div className='flex items-center justify-between'>
      <span className='text-gray-500 flex items-center'>
        <span className={cn('w-2 h-2 rounded-full mr-2', iconColors[icon])}></span>
        {label}
      </span>
      <span className='font-medium'>{value}</span>
    </div>
  )
}

const NoBackupDisplay = () => (
  <div className='mt-4 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800/50'>
    <h5 className='font-semibold text-sm text-gray-600 dark:text-gray-400 tracking-wide'>Backup</h5>
    <div className='flex items-center justify-center py-2'>
      <div className='text-center'>
        <div className='w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2'>
          <svg
            className='w-4 h-4 text-gray-500 dark:text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3a2 2 0 01-2 2H9a2 2 0 01-2-2H4'
            />
          </svg>
        </div>
        <p className='text-sm text-gray-500 dark:text-gray-400'>No backup found</p>
      </div>
    </div>
  </div>
)

export const BackupStatusDisplay = ({ vm, className }: BackupStatusDisplayProps) => {
  const activeBackupStatus = useActiveBackupStatus(vm)
  const backupStatus = useBackupStatus(vm)

  // If no backup data is loaded or no backup info exists, show no backup display
  if (!backupStatus.isDataLoaded || !backupStatus.lastBackupInfo) {
    return <NoBackupDisplay />
  }

  // Determine styling based on backup status
  const isActive = activeBackupStatus.hasActiveBackup
  const isHistorical = activeBackupStatus.hasHistoricalBackup

  const containerStyles = cn(
    'mt-4 p-3 rounded-md relative overflow-hidden',
    isActive
      ? 'border-2 border-green-400 bg-green-50 dark:bg-green-900/20'
      : isHistorical
        ? 'border-2 border-orange-400 bg-orange-50 dark:bg-orange-900/20'
        : 'border border-gray-200 dark:border-gray-700',
    className
  )

  const titleStyles = cn(
    'font-semibold text-sm mb-2 tracking-wide flex items-center',
    isActive
      ? 'text-green-700 dark:text-green-300'
      : isHistorical
        ? 'text-orange-700 dark:text-orange-300'
        : 'text-gray-700 dark:text-gray-300'
  )

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', { timeZone: 'Europe/Oslo' })
  }

  return (
    <div className={containerStyles}>
      {/* Status Badge */}
      {isActive && (
        <div className='absolute top-0 right-0 bg-green-400 text-white text-xs px-2 py-1 rounded-bl-md font-medium'>
          ACTIVE
        </div>
      )}
      {isHistorical && (
        <div className='absolute top-0 right-0 bg-orange-400 text-white text-xs px-2 py-1 rounded-bl-md font-medium'>
          HISTORICAL
        </div>
      )}

      {/* Title with Status Indicator */}
      <h5 className={titleStyles}>
        {isActive && <span className='w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse'></span>}
        {isHistorical && <span className='w-2 h-2 bg-orange-400 rounded-full mr-2'></span>}
        Last Backup
      </h5>

      {/* Backup Information */}
      <div className='grid grid-cols-1 gap-2 text-xs'>
        <BackupInfoItem
          icon='started'
          label='Run started'
          value={backupStatus.lastBackupInfo.startTime ? formatDateTime(backupStatus.lastBackupInfo.startTime) : 'N/A'}
        />
        <BackupInfoItem
          icon='ended'
          label='Run ended'
          value={backupStatus.lastBackupInfo.endTime ? formatDateTime(backupStatus.lastBackupInfo.endTime) : 'N/A'}
        />
        <BackupInfoItem
          icon='expires'
          label='Run expires'
          value={
            backupStatus.lastBackupInfo.expiryTime ? formatDateTime(backupStatus.lastBackupInfo.expiryTime) : 'N/A'
          }
        />
      </div>
    </div>
  )
}
