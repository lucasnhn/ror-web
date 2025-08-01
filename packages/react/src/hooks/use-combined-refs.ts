import type { Ref } from 'react'
import { useEffect, useRef } from 'react'

export const useCombinedRefs = <T>(...refs: (Ref<T> | undefined)[]) => {
  const targetRef = useRef<T>(null)

  useEffect(() => {
    if (targetRef.current === null) return

    refs.forEach((ref) => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        if ('current' in ref) {
          ;(ref as React.MutableRefObject<T | null>).current = targetRef.current
        }
      }
    })
  }, [refs])

  return targetRef
}
