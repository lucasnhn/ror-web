'use client'

import { useEffect, useState } from 'react'
import type { Layouts } from 'react-grid-layout'
import {
  getSavedUserPreferenceObject,
  updateUserPreferenceObject,
  PREFERENCES_KEY,
  DEFAULT_USERPREFERENCES,
  Preferences,
} from '@/utils/user-preferences'
import { LayoutKey } from '@/types/layouts'

/**
 * Type guard that checks whether a value matches the expected "Layouts" shape.
 *
 * The predicate returns true when the provided value is a non-null object and
 * every property value is either `undefined` or an `Array` (i.e. Array<unknown>).
 * Use this function in conditional checks to narrow an `unknown` value to the
 * `Layouts` type.
 */
function isLayouts(value: unknown): value is Layouts {
  if (!value || typeof value !== 'object') return false
  return Object.values(value as Record<string, unknown>).every(
    (layout) => layout === undefined || Array.isArray(layout)
  )
}

const LOG_NS = '[useLayoutPreferences]'

/**
 * A reusable hook to persist and manage user-specific layout configurations.
 *
 * @param key - The property key inside userPreferences (e.g. "clusterCards")
 * @param defaultLayouts - Default layout configuration if none is found in localStorage
 */
export function useLayoutPreferences(key: LayoutKey, defaultLayouts: Layouts) {
  const isClient = typeof window !== 'undefined'
  const [layouts, setLayouts] = useState<Layouts>(() => {
    if (!isClient) {
      console.info(`${LOG_NS} SSR: returning defaultLayouts`)
      return defaultLayouts
    }
    try {
      const prefs = getSavedUserPreferenceObject(PREFERENCES_KEY, DEFAULT_USERPREFERENCES)
      const saved = (prefs as Preferences)[key]?.layouts
      const result = isLayouts(saved) ? saved : defaultLayouts
      console.info(`${LOG_NS} init`, {
        isClient,
        key,
        hasSaved: !!saved,
        savedKeys: saved ? Object.keys(saved) : [],
      })
      return result
    } catch (e) {
      console.warn(`${LOG_NS} init parse error, falling back to defaults`, e)
      return defaultLayouts
    }
  })
  const [layoutKey, setLayoutKey] = useState(0)
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg')
  const [hasManualReset, setHasManualReset] = useState(false)

  useEffect(() => {
    if (!isClient || hasManualReset) return
    try {
      const prefs = getSavedUserPreferenceObject(PREFERENCES_KEY, DEFAULT_USERPREFERENCES)
      const saved = (prefs as Preferences)[key]?.layouts
      const next = isLayouts(saved) ? saved : defaultLayouts
      setLayouts(next)
      console.info(`${LOG_NS} effect->load`, { key, hasSaved: !!saved })
    } catch (e) {
      console.warn(`${LOG_NS} effect->load error`, e)
    }
  }, [key, defaultLayouts, isClient, hasManualReset])

  const saveLayouts = (newLayouts: Layouts) => {
    try {
      console.info(`${LOG_NS} saveLayouts`, {
        key,
        currentBreakpoint,
        newKeys: Object.keys(newLayouts || {}),
        bpCount: (newLayouts?.[currentBreakpoint] || []).length,
      })
      setLayouts(newLayouts)
      updateUserPreferenceObject(PREFERENCES_KEY, {
        [key]: { layouts: newLayouts },
      })
    } catch (e) {
      console.error(`${LOG_NS} saveLayouts error`, e)
    }
  }

  const resetToDefault = () => {
    try {
      setLayouts(defaultLayouts)
      updateUserPreferenceObject(PREFERENCES_KEY, { [key]: { layouts: defaultLayouts } })
      setLayoutKey((prev) => prev + 1)
      setHasManualReset(true)
      console.info(`${LOG_NS} resetToDefault applied`)
    } catch (e) {
      console.error(`${LOG_NS} resetToDefault error`, e)
    }
  }

  const resetToSaved = () => {
    try {
      const prefs = getSavedUserPreferenceObject(PREFERENCES_KEY, DEFAULT_USERPREFERENCES)
      const saved = (prefs as Preferences)[key]?.layouts
      if (isLayouts(saved)) {
        setLayouts(saved)
        setLayoutKey((prev) => prev + 1)
        setHasManualReset(true)
        console.info(`${LOG_NS} resetToSaved applied`)
      }
    } catch (e) {
      console.error(`${LOG_NS} resetToSaved error`, e)
    }
  }

  return {
    layouts,
    setLayouts: (next: Layouts) => {
      console.info(`${LOG_NS} setLayouts (unpersisted)`, {
        key,
        nextKeys: Object.keys(next || {}),
      })
      setLayouts(next)
    },
    layoutKey,
    setLayoutKey: (fnOrVal: any) => {
      const next = typeof fnOrVal === 'function' ? fnOrVal(layoutKey) : fnOrVal
      console.info(`${LOG_NS} setLayoutKey`, { from: layoutKey, to: next })
      setLayoutKey(next)
    },
    currentBreakpoint,
    setCurrentBreakpoint: (bp: string) => {
      console.info(`${LOG_NS} setCurrentBreakpoint`, { from: currentBreakpoint, to: bp })
      setCurrentBreakpoint(bp)
    },
    saveLayouts,
    resetToSaved,
    resetToDefault,
  }
}
