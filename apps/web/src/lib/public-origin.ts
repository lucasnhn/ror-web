import type { NextRequest } from 'next/server'

export function getPublicOrigin(req: NextRequest, fallbackOrigin: string): string {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL
  const proto = req.headers.get('x-forwarded-proto') || undefined
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || undefined
  if (proto && host) return `${proto}://${host}`
  return fallbackOrigin
}
