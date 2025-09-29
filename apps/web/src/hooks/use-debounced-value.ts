import { useEffect, useState } from 'react'

/**
 * Custom hook that returns a debounced version of a value.
 *
 * The returned value will only update after the specified delay has elapsed
 * since the last change to the input value. Useful for reducing the frequency
 * of expensive operations (e.g., API calls) triggered by rapidly changing values.
 *
 * @typeParam T - The type of the value to debounce.
 * @param value - The value to debounce.
 * @param delay - The debounce delay in milliseconds. Defaults to 120ms.
 * @returns The debounced value.
 */
export function useDebouncedValue<T>(value: T, delay = 120): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return debounced
}
