'use server'

import { authGuard } from '@/features/auth/utils/auth-guard'
import { setSavedPreference } from '@/utils/cookies'

export async function saveLeftPanelPreferenceAction(value: boolean) {
  await authGuard()
  await setSavedPreference('ror.left-panel-expanded', value.toString())
}
