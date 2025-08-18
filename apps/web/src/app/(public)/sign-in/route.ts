// import { signIn } from '@/config/next-auth'
// import { routes } from '@/config/routes'

// /**
//  * Redirect the user instantly to Dex where they can choose a provider to login with
//  * We do this to reduce the amount of clicks a user might need to do in order to login.
//  */
// export async function GET() {
//   await signIn('dex', {
//     redirectTo: routes.app.clusters.getHref(),
//   })
// }

import { NextRequest, NextResponse } from 'next/server'
import { routes } from '@/config/routes'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const error = url.searchParams.get('error')
  const attempt = Number(url.searchParams.get('attempt') || '0') || 0

  // Derive a safe callback URL
  const defaultAfterLogin = routes.app.clusters.getHref()
  let raw = url.searchParams.get('callbackUrl') || defaultAfterLogin
  const debug = process.env.AUTH_DEBUG === 'true' || process.env.NODE_ENV !== 'production'
  if (debug) console.log('[AUTH][SIGNIN] incoming', { raw, error })

  // Only allow same-origin URLs and prefer relative paths
  try {
    if (/^https?:\/\//i.test(raw)) {
      const target = new URL(raw)
      raw = target.origin === url.origin ? target.pathname + target.search + target.hash : defaultAfterLogin
    }
  } catch {
    raw = defaultAfterLogin
  }

  // Prevent redirect loops back into auth endpoints
  const lower = raw.toLowerCase()
  const isLoopTarget = lower.startsWith('/sign-in') || lower.startsWith('/api/auth')
  const safeCallback = isLoopTarget ? defaultAfterLogin : raw
  if (debug) console.log('[AUTH][SIGNIN] sanitized', { safeCallback })

  // If NextAuth reported a known error, do NOT bounce to /api/auth/signin because pages.signIn is configured
  // which would redirect straight back here and loop. Instead, send users to our debug/error page.
  // Ignore unknown values (e.g. some providers append their id in this param when using custom pages).
  const knownErrors = new Set([
    'AccessDenied',
    'Configuration',
    'Callback',
    'OAuthSignin',
    'OAuthCallback',
    'OAuthCreateAccount',
    'EmailCreateAccount',
    'EmailSignin',
    'CredentialsSignin',
    'SessionRequired',
    'Default',
  ])
  if (error && knownErrors.has(error)) {
    const to = new URL('/auth-debug', url.origin)
    to.searchParams.set('error', error)
    to.searchParams.set('callbackUrl', safeCallback)
    if (debug) console.log('[AUTH][SIGNIN] redirect(error→auth-debug)', { to: to.toString() })
    return NextResponse.redirect(to, { status: 302 })
  }

  // If NextAuth bounced back with a non-standard "error" (often the provider id), avoid infinite loops.
  // Also stop looping after a first automatic attempt.
  if (error && !knownErrors.has(error)) {
    const to = new URL('/sign-in-debug', url.origin)
    to.searchParams.set('callbackUrl', safeCallback)
    to.searchParams.set('reason', 'provider-indicated')
    if (debug) console.log('[AUTH][SIGNIN] redirect(provider-indicated→sign-in-debug)', { to: to.toString() })
    return NextResponse.redirect(to, { status: 302 })
  }

  if (attempt >= 1) {
    const to = new URL('/sign-in-debug', url.origin)
    to.searchParams.set('callbackUrl', safeCallback)
    to.searchParams.set('reason', 'attempted')
    if (debug) console.log('[AUTH][SIGNIN] redirect(attempt-guard→sign-in-debug)', { to: to.toString() })
    return NextResponse.redirect(to, { status: 302 })
  }

  // Optional: verify that 'dex' provider is actually registered to avoid a confusing loop
  try {
    const pRes = await fetch(new URL('/api/auth/providers', url.origin), { cache: 'no-store' })
    const providers = (await pRes.json()) as Record<string, unknown> | null
    if (debug) console.log('[AUTH][SIGNIN] providers', providers)
    const hasDex = providers && Object.prototype.hasOwnProperty.call(providers, 'dex')
    if (!hasDex) {
      const to = new URL('/auth-debug', url.origin)
      to.searchParams.set('error', 'missing-provider-dex')
      to.searchParams.set('callbackUrl', safeCallback)
      if (debug) console.log('[AUTH][SIGNIN] redirect(missing-provider→auth-debug)', { to: to.toString() })
      return NextResponse.redirect(to, { status: 302 })
    }
  } catch (e) {
    if (debug) console.log('[AUTH][SIGNIN] providers check failed', String(e))
  }

  // Normal case: go straight to Dex provider with sanitized callback
  const to = new URL('/api/auth/signin/dex', url.origin)
  to.searchParams.set('callbackUrl', safeCallback)
  if (debug) console.log('[AUTH][SIGNIN] redirect', { to: to.toString() })
  return NextResponse.redirect(to, { status: 302 })
}
