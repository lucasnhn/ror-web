/**
 * Health check endpoint for Kubernetes and other monitoring systems
 * This endpoint is public and doesn't require authentication
 */
import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
}
