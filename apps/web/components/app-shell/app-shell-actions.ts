export const LEFT_PANEL_STORAGE_KEY = 'ror.left-panel-expanded'
import { getSavedPreference, setSavedPreference } from '@/utils/cookies'

export async function saveLeftPanelPreferenceAction(value: boolean) {
  await setSavedPreference(LEFT_PANEL_STORAGE_KEY, value)
}

export async function getLeftPanelPreferenceAction(): Promise<boolean> {
  const value = await getSavedPreference(LEFT_PANEL_STORAGE_KEY, true)
  return value
}
