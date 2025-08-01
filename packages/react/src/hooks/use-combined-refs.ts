import type { Ref } from 'react'
import { useEffect, useRef } from 'react'

/**
 * Combines multiple refs (forwarded and local) into a single ref.
 *
 * @template T
 * @param - One or more refs to combine.
 * @returns A combined ref that points to the same node.
 */
export const useCombinedRefs = <T>(...refs: (Ref<T> | undefined)[]) => {
  const targetRef = useRef<T>(null)

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else if ('current' in ref) {
        // Only assign if 'current' is writable
        try {
          ;(ref as React.MutableRefObject<T | null>).current = targetRef.current
        } catch {
          // Ignore if 'current' is read-only
        }
      }
    })
  }, [refs])

  return targetRef
}
