export const LEFT_PANEL_STORAGE_KEY = 'ror.left-panel-expanded'
import { getSavedPreference, setSavedPreference } from '@/utils/cookies'

export async function saveLeftPanelPreferenceAction(value: boolean) {
  await setSavedPreference(LEFT_PANEL_STORAGE_KEY, value.toString())
}

export async function getLeftPanelPreferenceAction(): Promise<boolean> {
  const value = await getSavedPreference(LEFT_PANEL_STORAGE_KEY, 'true')
  const validValue = validateLeftPanelPreference(value)
  return validValue
}

function validateLeftPanelPreference(value: string): boolean {
  const isBoolean = value === 'true' || value === 'false'
  if (!isBoolean) {
    throw new Error(`Invalid value for left panel preference. Expected string 'true' or 'false', got ${typeof value}`)
  }
  return value === 'true' ? true : false
}
