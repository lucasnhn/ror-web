'use client'

import { useEffect, useState, type SetStateAction } from 'react'
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
  // in-memory snapshot of the saved layouts for the current session.
  // This prevents a race where we write to persistent storage and immediately
  // read it back (which can return stale data in some production setups).
  const [savedLayouts, setSavedLayouts] = useState<Layouts | null>(() => {
    if (!isClient) return null
    try {
      const prefs = getSavedUserPreferenceObject(PREFERENCES_KEY, DEFAULT_USERPREFERENCES)
      const saved = (prefs as Preferences)[key]?.layouts
      return isLayouts(saved) ? clone(saved) : null
    } catch {
      return null
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
      // keep an in-memory copy of what's saved remotely/localStorage so
      // subsequent "resetToSaved" during this session doesn't re-read a
      // possibly-stale persistent store.
      setSavedLayouts(isLayouts(saved) ? clone(saved) : null)
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
      // update the in-memory snapshot immediately so resetToSaved uses the
      // latest data in this session without having to read persistent store.
      setSavedLayouts(clone(newLayouts))
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
      // update both persisted store and the in-memory snapshot so further
      // "resetToSaved" calls in this session reflect the new default state.
      updateUserPreferenceObject(PREFERENCES_KEY, { [key]: { layouts: defaultLayouts } })
      setSavedLayouts(clone(defaultLayouts))
      setLayoutKey((prev) => prev + 1)
      setHasManualReset(true)
      console.info(`${LOG_NS} resetToDefault applied`)
    } catch (e) {
      console.error(`${LOG_NS} resetToDefault error`, e)
    }
  }

  const resetToSaved = () => {
    try {
      // Prefer the in-memory snapshot when available. This avoids a race where
      // we just saved and then read from a persistent store that may not have
      // the latest value yet in some environments.
      const prefs = getSavedUserPreferenceObject(PREFERENCES_KEY, DEFAULT_USERPREFERENCES)
      const persisted = (prefs as Preferences)[key]?.layouts
      const candidate = savedLayouts ?? (isLayouts(persisted) ? persisted : undefined)
      if (candidate && isLayouts(candidate)) {
        setLayouts(candidate)
        setLayoutKey((prev) => prev + 1)
        setHasManualReset(true)
        console.info(`${LOG_NS} resetToSaved applied (from ${savedLayouts ? 'memory' : 'persisted'})`)
      } else {
        console.info(`${LOG_NS} resetToSaved nothing to apply`)
      }
    } catch (e) {
      console.error(`${LOG_NS} resetToSaved error`, e)
    }
  }

  // const getCurrentLayouts = () => {
  //   const prefs = getSavedUserPreferenceObject(PREFERENCES_KEY, DEFAULT_USERPREFERENCES)
  //   console.log('getCurrentLayouts prefs: ', prefs)
  //   return prefs
  // }

  // Helper to produce a deep clone of layouts using structuredClone when
  // available, falling back to JSON serialization.
  function clone<T>(v: T): T {
    try {
      const sc = (globalThis as unknown as { structuredClone?: (v: unknown) => unknown }).structuredClone
      if (typeof sc === 'function') return sc(v) as T
      return JSON.parse(JSON.stringify(v))
    } catch {
      return JSON.parse(JSON.stringify(v))
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
    setLayoutKey: (fnOrVal: SetStateAction<number>) => {
      const next = typeof fnOrVal === 'function' ? (fnOrVal as (prev: number) => number)(layoutKey) : fnOrVal
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
    // getCurrentLayouts,
  }
}
