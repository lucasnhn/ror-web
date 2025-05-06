import { NextResponse } from 'next/server'
import { COLOR_SCHEME_COOKIE_KEY, ColorScheme, validateColorScheme } from '@/utils/dark-mode'
import { deleteSavedPreference, setSavedPreference } from '@/utils/cookies'
import { authGuard } from '@/features/auth/utils/auth-guard'

export async function POST(req: Request) {
  await authGuard()
  try {
    const { value } = await req.json()
    const colorScheme = validateColorScheme(value)

    if (colorScheme === ColorScheme.System) {
      await deleteSavedPreference(COLOR_SCHEME_COOKIE_KEY)
    } else {
      await setSavedPreference(COLOR_SCHEME_COOKIE_KEY, colorScheme)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to set dark mode preference:', error)
    return NextResponse.json({ error: 'Failed to save theme' }, { status: 500 })
  }
}
