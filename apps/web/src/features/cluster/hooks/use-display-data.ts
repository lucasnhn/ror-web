import { useEffect, useState } from 'react'
import { ClusterCardDisplayData } from '../types/display-data'

/**
 * Custom React hook for managing and persisting cluster card display data selection.
 *
 * This hook provides state and a setter for an array of `ClusterCardDisplayData` objects,
 * automatically synchronizing the selection with `localStorage` under the key
 * `'selectedDisplayData:clusters'`. On initialization, it loads the selection from
 * `localStorage` if available, and updates `localStorage` whenever the selection changes.
 *
 * @returns An object containing:
 * - `selectedDisplayData`: The current array of selected cluster card display data.
 * - `setSelectedDisplayData`: A setter function to update the selection.
 */
export function useDisplayData() {
  const [selectedDisplayData, setSelectedDisplayData] = useState<ClusterCardDisplayData[]>(() => {
    try {
      const stored = localStorage.getItem('selectedDisplayData:clusters')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      const serialized = JSON.stringify(selectedDisplayData)
      if (localStorage.getItem('selectedDisplayData:clusters') !== serialized) {
        localStorage.setItem('selectedDisplayData:clusters', serialized)
      }
    } catch (error) {
      console.error('Error saving selectedDisplayData to localStorage:', error)
    }
  }, [selectedDisplayData])

  return { selectedDisplayData, setSelectedDisplayData }
}
