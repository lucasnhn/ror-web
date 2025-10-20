import { useEffect, useState } from 'react'

/**
 * Custom React hook for managing and persisting display data selection per domain using localStorage.
 *
 * @template T - The type of the display data items.
 * @param {string} domain - A unique domain identifier used as a key for localStorage.
 * @returns {{
 *   selectedDisplayData: T[];
 *   setSelectedDisplayData: React.Dispatch<React.SetStateAction<T[]>>;
 * }} An object containing the currently selected display data and a setter function.
 */
export function useDisplayData<T>(domain: string) {
  const [selectedDisplayData, setSelectedDisplayData] = useState<T[]>(() => {
    try {
      const stored = localStorage.getItem(`selectedDisplayData:${domain}`)
      return stored ? (JSON.parse(stored) as T[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      const serialized = JSON.stringify(selectedDisplayData)
      if (localStorage.getItem(`selectedDisplayData:${domain}`) !== serialized) {
        localStorage.setItem(`selectedDisplayData:${domain}`, serialized)
      }
    } catch (error) {
      console.error(`Error saving selectedDisplayData for ${domain}:`, error)
    }
  }, [selectedDisplayData, domain])

  return { selectedDisplayData, setSelectedDisplayData }
}
