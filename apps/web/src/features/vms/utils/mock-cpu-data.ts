import { cpuUsageHistory } from '../utils/cpu-usage-history'

/**
 * Utility to generate mock CPU usage data for testing
 */
export const generateMockCpuData = (
  vmId: string,
  options?: {
    days?: number
    baseUsage?: number
    variance?: number
    trend?: 'up' | 'down' | 'stable'
  }
) => {
  const { days = 1, baseUsage = 45, variance = 20, trend = 'stable' } = options || {}

  const now = new Date()
  const intervalMs = 15 * 60 * 1000 // 15 minutes
  const totalPoints = Math.floor((days * 24 * 60 * 60 * 1000) / intervalMs)

  // Clear existing data first
  cpuUsageHistory.clearHistory(vmId)

  for (let i = 0; i < totalPoints; i++) {
    const timestamp = new Date(now.getTime() - (totalPoints - i - 1) * intervalMs)

    // Generate CPU usage with trend
    let trendFactor = 0
    if (trend === 'up') {
      trendFactor = (i / totalPoints) * 15 // Gradual increase
    } else if (trend === 'down') {
      trendFactor = -((i / totalPoints) * 15) // Gradual decrease
    }

    // Add some randomness and daily patterns
    const timeOfDay = timestamp.getHours()
    const dailyPattern = Math.sin((timeOfDay / 24) * Math.PI * 2) * 10 // Peak during day
    const randomVariance = (Math.random() - 0.5) * variance

    let usage = baseUsage + trendFactor + dailyPattern + randomVariance

    // Add occasional spikes
    if (Math.random() < 0.05) {
      // 5% chance of spike
      usage += Math.random() * 30
    }

    // Ensure within bounds
    usage = Math.max(0, Math.min(100, usage))

    // Simulate storage with proper granularity
    const mockDataPoint = {
      timestamp,
      value: Math.round(usage * 100) / 100,
      vmId,
    }

    // Directly add to localStorage (bypassing granularity for testing)
    const existingData = cpuUsageHistory.getHistory(vmId, 'daily')
    const updatedData = [...existingData, mockDataPoint]
    localStorage.setItem(`cpu-usage-history-${vmId}`, JSON.stringify(updatedData))
  }

  console.log(`Generated ${totalPoints} mock CPU usage data points for VM ${vmId}`)
  return cpuUsageHistory.getChartData(vmId, 'daily')
}

/**
 * Generate mock data for different scenarios
 */
export const generateTestScenarios = (vmId: string) => {
  return {
    stable: () => generateMockCpuData(vmId, { baseUsage: 35, variance: 10, trend: 'stable' }),
    increasing: () => generateMockCpuData(vmId, { baseUsage: 20, variance: 15, trend: 'up' }),
    decreasing: () => generateMockCpuData(vmId, { baseUsage: 70, variance: 15, trend: 'down' }),
    highUsage: () => generateMockCpuData(vmId, { baseUsage: 85, variance: 10, trend: 'stable' }),
    volatile: () => generateMockCpuData(vmId, { baseUsage: 50, variance: 30, trend: 'stable' }),
    weeklyData: () => generateMockCpuData(vmId, { days: 7, baseUsage: 40, variance: 20, trend: 'stable' }),
  }
}
