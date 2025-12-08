import { NextResponse } from 'next/server'
import { genAI } from '@/lib/gemini'

export async function GET() {
  try {
    // Try to list models using the REST API directly
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`)
    const data = await response.json()
    return NextResponse.json({ models: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to list models' },
      { status: 500 }
    )
  }
}

