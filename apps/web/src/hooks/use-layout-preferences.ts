'use client'

import { useEffect, useState } from 'react'
import type { Layouts } from 'react-grid-layout'
import {
  getSavedUserPreferenceObject,
  updateUserPreferenceObject,
  PREFERENCES_KEY,
  DEFAULT_USERPREFERENCES,
} from '@/utils/user-preferences'

/**
 * A reusable hook to persist and manage user-specific layout configurations.
 *
 * @param key - The property key inside userPreferences (e.g. "clusterCards")
 * @param defaultLayouts - Default layout configuration if none is found in localStorage
 */
export function useLayoutPreferences(key: keyof typeof DEFAULT_USERPREFERENCES, defaultLayouts: Layouts) {
  const [layouts, setLayouts] = useState<Layouts>(defaultLayouts)
  const [layoutKey, setLayoutKey] = useState(0)
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg')

  useEffect(() => {
    const prefs = getSavedUserPreferenceObject(PREFERENCES_KEY)
    const savedLayouts = prefs.clusterCards?.layouts || defaultLayouts
    setLayouts(savedLayouts)
  }, [defaultLayouts])

  const saveLayouts = (newLayouts: Layouts) => {
    setLayouts(newLayouts)
    updateUserPreferenceObject(PREFERENCES_KEY, {
      clusterCards: { layouts: newLayouts },
    })
  }

  const resetToDefault = () => {
    setLayouts(defaultLayouts)
    updateUserPreferenceObject(PREFERENCES_KEY, {
      clusterCards: { layouts: defaultLayouts },
    })
    setLayoutKey((prev) => prev + 1)
  }

  const resetToSaved = () => {
    const prefs = getSavedUserPreferenceObject(PREFERENCES_KEY, DEFAULT_USERPREFERENCES)
    const savedLayouts = prefs.clusterCards?.layouts
    if (savedLayouts) {
      setLayouts(savedLayouts)
      setLayoutKey((prev) => prev + 1)
    }
  }

  return {
    layouts,
    setLayouts,
    layoutKey,
    setLayoutKey,
    currentBreakpoint,
    setCurrentBreakpoint,
    saveLayouts,
    resetToSaved,
    resetToDefault,
  }
}
