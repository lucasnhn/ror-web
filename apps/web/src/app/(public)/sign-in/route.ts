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

import { NextResponse } from 'next/server'

/**
 * Hitting /sign-in should kick off Dex auth immediately.
 * v4 server-side: redirect to the provider route.
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const callbackUrl = url.searchParams.get('callbackUrl') ?? '/'
  const target = new URL(`/api/auth/signin/dex?callbackUrl=${encodeURIComponent(callbackUrl)}`, url.origin)
  return NextResponse.redirect(target)
}
