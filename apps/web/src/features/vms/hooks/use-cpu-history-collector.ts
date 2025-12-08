import { useEffect, useRef } from 'react'
import { cpuUsageHistory, CpuHistoryTimeRange } from '../utils/cpu-usage-history'

interface UseCpuHistoryCollectorOptions {
  vmId: string
  currentCpuUsage?: number
  timeRange?: CpuHistoryTimeRange
  collectInterval?: number // milliseconds between collections
  enabled?: boolean
}

/**
 * Hook to automatically collect CPU usage history
 *
 * This hook will:
 * - Collect CPU usage data at regular intervals
 * - Store it in localStorage with appropriate granularity
 * - Handle cleanup when component unmounts
 */
export const useCpuHistoryCollector = ({
  vmId,
  currentCpuUsage,
  timeRange = 'daily',
  collectInterval = 60000, // 1 minute default
  enabled = true,
}: UseCpuHistoryCollectorOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastCollectedRef = useRef<number | undefined>(undefined)

  // Clear interval on unmount or when disabled
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Set up automatic collection
  useEffect(() => {
    if (!enabled || !vmId || vmId === 'unknown' || currentCpuUsage === undefined) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Add immediate reading if value changed
    if (lastCollectedRef.current !== currentCpuUsage) {
      cpuUsageHistory.addReading(vmId, currentCpuUsage, timeRange)
      lastCollectedRef.current = currentCpuUsage
    }

    // Set up interval for periodic collection
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (currentCpuUsage !== undefined) {
          cpuUsageHistory.addReading(vmId, currentCpuUsage, timeRange)
          lastCollectedRef.current = currentCpuUsage
        }
      }, collectInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [vmId, currentCpuUsage, timeRange, collectInterval, enabled])

  return {
    // Utility functions
    getHistory: () => cpuUsageHistory.getHistory(vmId, timeRange),
    getChartData: () => cpuUsageHistory.getChartData(vmId, timeRange),
    getStats: () => cpuUsageHistory.getStats(vmId, timeRange),
    clearHistory: () => cpuUsageHistory.clearHistory(vmId),
    addManualReading: (usage: number) => cpuUsageHistory.addReading(vmId, usage, timeRange),
  }
}
