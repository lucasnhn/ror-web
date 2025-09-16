import { NextResponse } from 'next/server'

//const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:10000'
const BACKEND_URL = 'http://localhost:10000'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const backendUrl = `${BACKEND_URL}/v2/resources?${searchParams.toString()}`

  try {
    const res = await fetch(backendUrl)
    if (!res.ok) {
      const text = await res.text()
      console.error('Backend error:', res.status, text)
      return NextResponse.json({ resources: [] }, { status: 200 })
    }
    const data = await res.json()
    if (!Array.isArray(data.resources)) {
      return NextResponse.json({ resources: [] }, { status: 200 })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error('API route error:', err)
    return NextResponse.json({ resources: [] }, { status: 200 })
  }
}
