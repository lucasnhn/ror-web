import { format } from 'date-fns'

export interface CpuUsageDataPoint {
  timestamp: Date
  value: number
  vmId: string
}

export interface CpuHistoryConfig {
  maxDataPoints: number
  timeWindowMs: number // How long to keep data (in milliseconds)
  granularityMs: number // Minimum time between readings (in milliseconds)
}

// Default configurations for different time ranges
export const CPU_HISTORY_CONFIGS = {
  hourly: {
    maxDataPoints: 60, // 60 data points
    timeWindowMs: 60 * 60 * 1000, // 1 hour
    granularityMs: 60 * 1000, // 1 minute intervals
  },
  daily: {
    maxDataPoints: 96, // 96 data points
    timeWindowMs: 24 * 60 * 60 * 1000, // 24 hours
    granularityMs: 15 * 60 * 1000, // 15 minute intervals
  },
  weekly: {
    maxDataPoints: 168, // 168 data points
    timeWindowMs: 7 * 24 * 60 * 60 * 1000, // 7 days
    granularityMs: 60 * 60 * 1000, // 1 hour intervals
  },
} as const

export type CpuHistoryTimeRange = keyof typeof CPU_HISTORY_CONFIGS

class CpuUsageHistory {
  private getStorageKey(vmId: string): string {
    return `cpu-usage-history-${vmId}`
  }

  /**
   * Add a new CPU usage reading for a VM
   */
  addReading(vmId: string, cpuUsage: number, timeRange: CpuHistoryTimeRange = 'daily'): void {
    const config = CPU_HISTORY_CONFIGS[timeRange]
    const now = new Date()

    try {
      const existingData = this.getHistory(vmId, timeRange)

      // Check if we should add this reading based on granularity
      if (existingData.length > 0) {
        const lastReading = existingData[existingData.length - 1]
        const timeDiff = now.getTime() - new Date(lastReading.timestamp).getTime()

        if (timeDiff < config.granularityMs) {
          // Too soon since last reading, skip
          return
        }
      }

      // Create new data point
      const newDataPoint: CpuUsageDataPoint = {
        timestamp: now,
        value: cpuUsage,
        vmId,
      }

      // Add to existing data
      const updatedData = [...existingData, newDataPoint]

      // Clean up old data and limit max points
      const cleanedData = this.cleanupData(updatedData, config)

      // Save to localStorage
      localStorage.setItem(this.getStorageKey(vmId), JSON.stringify(cleanedData))
    } catch (error) {
      console.warn('Failed to save CPU usage history:', error)
    }
  }

  /**
   * Get historical CPU usage data for a VM
   */
  getHistory(vmId: string, timeRange: CpuHistoryTimeRange = 'daily'): CpuUsageDataPoint[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey(vmId))
      if (!stored) {
        return []
      }

      const data: CpuUsageDataPoint[] = JSON.parse(stored)
      const config = CPU_HISTORY_CONFIGS[timeRange]

      // Convert timestamp strings back to Date objects and filter by time window
      const now = new Date()
      const cutoffTime = now.getTime() - config.timeWindowMs

      return data
        .map((point) => ({
          ...point,
          timestamp: new Date(point.timestamp),
        }))
        .filter((point) => point.timestamp.getTime() > cutoffTime)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    } catch (error) {
      console.warn('Failed to load CPU usage history:', error)
      return []
    }
  }

  /**
   * Get formatted chart data ready for Recharts
   */
  getChartData(
    vmId: string,
    timeRange: CpuHistoryTimeRange = 'daily'
  ): Array<{
    timestamp: string
    formattedTime: string
    cpuUsage: number
    rawTimestamp: Date
  }> {
    const history = this.getHistory(vmId, timeRange)

    return history.map((point) => ({
      timestamp: point.timestamp.toISOString(),
      formattedTime: this.formatTimeLabel(point.timestamp, timeRange),
      cpuUsage: point.value,
      rawTimestamp: point.timestamp,
    }))
  }

  /**
   * Clear all history for a VM
   */
  clearHistory(vmId: string): void {
    localStorage.removeItem(this.getStorageKey(vmId))
  }

  /**
   * Get the latest CPU usage value
   */
  getLatestReading(vmId: string, timeRange: CpuHistoryTimeRange = 'daily'): number | null {
    const history = this.getHistory(vmId, timeRange)
    return history.length > 0 ? history[history.length - 1].value : null
  }

  /**
   * Get statistics about the CPU usage history
   */
  getStats(
    vmId: string,
    timeRange: CpuHistoryTimeRange = 'daily'
  ): {
    average: number
    min: number
    max: number
    count: number
    trend: 'up' | 'down' | 'stable'
  } | null {
    const history = this.getHistory(vmId, timeRange)

    if (history.length === 0) {
      return null
    }

    const values = history.map((h) => h.value)
    const average = values.reduce((sum, val) => sum + val, 0) / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)

    // Calculate trend (compare first and last quarter of data)
    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (history.length >= 4) {
      const quarterSize = Math.floor(history.length / 4)
      const firstQuarter = values.slice(0, quarterSize)
      const lastQuarter = values.slice(-quarterSize)

      const firstAvg = firstQuarter.reduce((sum, val) => sum + val, 0) / firstQuarter.length
      const lastAvg = lastQuarter.reduce((sum, val) => sum + val, 0) / lastQuarter.length

      const diff = lastAvg - firstAvg
      if (Math.abs(diff) > 2) {
        // 2% threshold
        trend = diff > 0 ? 'up' : 'down'
      }
    }

    return {
      average: Math.round(average * 100) / 100,
      min,
      max,
      count: history.length,
      trend,
    }
  }

  private cleanupData(data: CpuUsageDataPoint[], config: CpuHistoryConfig): CpuUsageDataPoint[] {
    const now = new Date()
    const cutoffTime = now.getTime() - config.timeWindowMs

    // Filter by time window and limit to max data points
    return data
      .filter((point) => new Date(point.timestamp).getTime() > cutoffTime)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-config.maxDataPoints) // Keep only the most recent entries
  }

  private formatTimeLabel(timestamp: Date, timeRange: CpuHistoryTimeRange): string {
    switch (timeRange) {
      case 'hourly':
        return format(timestamp, 'HH:mm')
      case 'daily':
        return format(timestamp, 'HH:mm')
      case 'weekly':
        return format(timestamp, 'EEE HH:mm')
      default:
        return format(timestamp, 'HH:mm')
    }
  }
}

// Export a singleton instance
export const cpuUsageHistory = new CpuUsageHistory()
