'use server'

import { authGuard } from '@/features/auth/utils/auth-guard'
import { deleteSavedPreference, getSavedPreference, setSavedPreference } from '@/utils/cookies'
import { COLOR_SCHEME_COOKIE_KEY, ColorScheme, validateColorScheme } from '@/utils/dark-mode'

/**
 * Save the user's dark mode preference.
 * @param value The user's dark mode preference.
 */
export async function saveDarkModePreferenceAction(value: ColorScheme) {
  await authGuard()
  try {
    if (value === ColorScheme.System) {
      await deleteSavedPreference(COLOR_SCHEME_COOKIE_KEY)
    } else {
      await setSavedPreference(COLOR_SCHEME_COOKIE_KEY, value)
    }
  } catch (error) {
    console.error('Error saving dark mode preference:', error)
  }
}

/**
 * Get the user's dark mode preference from the cookie.
 * If the cookie is not set, return the default value.
 */
export async function getDarkModePreferenceAction(): Promise<ColorScheme> {
  try {
    const value = await getSavedPreference(COLOR_SCHEME_COOKIE_KEY, ColorScheme.System)
    const colorScheme = validateColorScheme(value)
    return colorScheme
  } catch (error) {
    console.error('Error getting dark mode preference:', error)
    return ColorScheme.System
  }
}
