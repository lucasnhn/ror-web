/**
 * Readiness probe endpoint for Kubernetes
 * This endpoint is public and doesn't require authentication
 * Typically used for Kubernetes readiness checks while the health endpoint is used for liveness probes
 */
import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    ready: true,
    version: process.env.NEXT_PUBLIC_APP_VERSION || 'development',
  })
}
