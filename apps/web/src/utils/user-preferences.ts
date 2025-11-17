// interface

import { z } from 'zod'

const cardSchema = z.object({
  layouts: z.record(z.string(), z.array(z.any())).default({}),
})

const userPreferencesSchema = z.object({
  key: z.string().default('user-preferences'),
  language: z.enum(['en', 'nb']).default('en'),
  darkMode: z.boolean().default(false),
  clusterCards: cardSchema.default({ layouts: {} }),
  vmDetails: cardSchema.default({ layouts: {} }),
})

export type ClusterCard = z.infer<typeof cardSchema>
export type VMDetails = z.infer<typeof cardSchema>
export type Preferences = z.infer<typeof userPreferencesSchema>

function getInitialDarkMode(): boolean {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false // fallback during SSR
}

export const PREFERENCES_KEY = 'user-preferences'
export const DEFAULT_USERPREFERENCES: Preferences = {
  key: PREFERENCES_KEY,
  language: 'nb',
  darkMode: getInitialDarkMode(),
  clusterCards: {} as ClusterCard,
  vmDetails: {} as VMDetails,
}

/**
 * Retrieve a saved user preference object from local storage
 * @remarks
 * This function retrieves a object stored in local storage by the specified key. If no value is found, returns the provided fallback value.
 * @param key - The key to look up in localStorage
 * @param defaultValue - The default value to return if no value is found for the key
 * @returns The stored preferences, or defaultValue
 */
export function getSavedUserPreferenceObject(
  key: string,
  defaultValue: Preferences = DEFAULT_USERPREFERENCES
): Preferences {
  try {
    const storedValues = window.localStorage.getItem(key)

    if (storedValues) {
      const parsed = JSON.parse(storedValues)

      // First try a strict parse
      const result = userPreferencesSchema.safeParse(parsed)
      if (result.success) return result.data

      // If strict parse fails, attempt a safe migration by merging the
      // parsed object into the default preferences and validating again.
      // This helps when production users have older or partial data.
      try {
        const migrated: Partial<Preferences> = {
          ...defaultValue,
          ...parsed,
          // attempt to shallow-merge known nested preference objects to
          // preserve nested layout maps instead of overwriting them.
          clusterCards: { ...(defaultValue.clusterCards ?? {}), ...(parsed.clusterCards ?? {}) },
          vmDetails: { ...(defaultValue.vmDetails ?? {}), ...(parsed.vmDetails ?? {}) },
        } as Partial<Preferences>

        const migratedResult = userPreferencesSchema.safeParse(migrated)
        if (migratedResult.success) {
          // Persist the migrated, validated preferences so subsequent reads
          // won't require migration.
          try {
            saveUserPreferencesObject(key, migratedResult.data)
          } catch (e) {
            // swallow persistence errors but still return the migrated data
            console.warn('Could not persist migrated user preferences', e)
          }
          return migratedResult.data
        }
      } catch (e) {
        console.warn('Migration attempt failed for user preferences', e)
      }

      // If everything fails, log and fall back to defaults.
      console.warn('User preferences failed validation, returning defaults')
    }
  } catch (error) {
    console.error('Could not get the user preferences from localstorage: ', error)
  }
  return defaultValue
}

/**
 * Saves userPreferencesObject to local storage.
 *
 * @param key - The key to look up in localStorage
 * @param preferenceObject - Object to store
 */
export function saveUserPreferencesObject(key: string, preferenceObject: Preferences): void {
  try {
    const validPrefs = userPreferencesSchema.parse(preferenceObject)
    const stringifiedObject = JSON.stringify(validPrefs)

    console.log('lagerer i localstorage; ', key, stringifiedObject)

    window.localStorage.setItem(key, stringifiedObject)
  } catch (error) {
    console.error('Could not save user preferences: ', error)
  }
}

/**
 * Updates userPreferencesObject in local storage.
 *
 * @param key - The key to look up in local storage
 * @param preferenceObject - new preferences on a object
 * use: updateUserPreferenceObject(PREFERENCES_KEY, { language: "en" });
 */
export function updateUserPreferenceObject(key: string, newPreferences: Partial<Preferences>): void {
  try {
    const currentPrefs = getSavedUserPreferenceObject(key, DEFAULT_USERPREFERENCES)
    const updatePrefs = { ...currentPrefs, ...newPreferences }

    const validPrefs = userPreferencesSchema.parse(updatePrefs)

    saveUserPreferencesObject(key, validPrefs)
  } catch (error) {
    console.error('Could not save user preferences: ', error)
  }
}
