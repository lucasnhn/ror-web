import type { NextRequest } from 'next/server'

/**
 * Resolve the correct public origin (scheme + host) for building absolute URLs.
 *
 * Why?
 * - When running behind a proxy, CDN, or load balancer, `req.url.origin` may
 *   not reflect the actual public-facing URL (e.g., it might be "http://localhost:3000").
 * - This helper ensures we always use the correct origin for redirects and
 *   tokens, preventing broken links or leaking internal hostnames.
 */
export function getPublicOrigin(req: NextRequest, fallbackOrigin: string): string {
  // 1. If explicitly set in config, always prefer NEXTAUTH_URL.
  //    This is the most reliable source and recommended in NextAuth.
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL
  // 2. Otherwise, try to infer from proxy headers:
  //    - x-forwarded-proto: scheme (http/https) seen by the client
  //    - x-forwarded-host:  hostname seen by the client
  //    - host: fallback if x-forwarded-host not set
  const proto = req.headers.get('x-forwarded-proto') || undefined
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || undefined
  // If both are present, construct a proper URL like "https://myapp.com"
  if (proto && host) return `${proto}://${host}`
  // 3. As a final fallback, use whatever origin we were passed in.
  //    This prevents crashes but may reflect an internal URL (less ideal).
  return fallbackOrigin
}
