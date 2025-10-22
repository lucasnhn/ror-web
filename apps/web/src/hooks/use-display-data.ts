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
  const [selectedDisplayData, setSelectedDisplayData] = useState<T[]>([])

  // On mount, update from localStorage if available
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(`selectedDisplayData:${domain}`)
      if (stored) {
        const parsed = JSON.parse(stored) as T[]
        // Only update if different to avoid unnecessary re-renders
        if (JSON.stringify(parsed) !== JSON.stringify(selectedDisplayData)) {
          setSelectedDisplayData(parsed)
        }
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain])

  // Keep localStorage updated only on the client
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const serialized = JSON.stringify(selectedDisplayData)
      const key = `selectedDisplayData:${domain}`
      if (localStorage.getItem(key) !== serialized) {
        localStorage.setItem(key, serialized)
      }
    } catch (error) {
      console.error(`Error saving selectedDisplayData for ${domain}:`, error)
    }
  }, [selectedDisplayData, domain])

  return { selectedDisplayData, setSelectedDisplayData }
}
