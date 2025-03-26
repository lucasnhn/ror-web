import { signIn } from '@/config/next-auth'
import { routes } from '@/config/routes'

/**
 * Redirect the user instantly to Dex where they can choose a provider to login with
 * We do this to reduce the amount of clicks a user might need to do in order to login.
 */
export async function GET() {
  /**
   * Note that "dex" is the id of the provider configured in {@link config/next-auth.ts}
   */
  await signIn('dex', {
    redirectTo: routes.app.clusters.getHref(),
  })
}
