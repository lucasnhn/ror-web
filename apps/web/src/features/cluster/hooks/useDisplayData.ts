import { useEffect, useState } from 'react'
import { ClusterCardDisplayData } from '../types/display-data'

/**
 * This hook synchronizes the selected display data with `localStorage`, ensuring that
 * the selection persists across page reloads.
 *
 * @returns An object containing:
 * - `selectedDisplayData`: The current array of selected cluster card display data.
 * - `setSelectedDisplayData`: A setter function to update the selection.
 */
export function useDisplayData() {
  const [selectedDisplayData, setSelectedDisplayData] = useState<ClusterCardDisplayData[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('selectedClusterDisplayData')
      if (stored) {
        const parsed = JSON.parse(stored) as ClusterCardDisplayData[]
        setSelectedDisplayData((prev) => {
          if (prev.length === parsed.length && prev.every((v, i) => v === parsed[i])) return prev
          return parsed
        })
      }
    } catch (error) {
      console.error('Error parsing selectedClusterDisplayData from localStorage:', error)
    }
  }, [])

  useEffect(() => {
    try {
      const serialized = JSON.stringify(selectedDisplayData)
      if (localStorage.getItem('selectedDisplayData') !== serialized) {
        localStorage.setItem('selectedDisplayData', serialized)
      }
    } catch (error) {
      console.error('Error saving selectedClusterDisplayData to localStorage:', error)
    }
  }, [selectedDisplayData])

  return { selectedDisplayData, setSelectedDisplayData }
}
