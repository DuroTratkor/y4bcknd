import { NextRequest, NextResponse } from 'next/server'
import { summarizeFile } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { fileContent, fileName, mimeType } = await request.json()

    if (!fileContent || !fileName) {
      return NextResponse.json(
        { error: 'Missing required fields: fileContent and fileName' },
        { status: 400 }
      )
    }

    const summary = await summarizeFile(fileContent, fileName, mimeType || 'text/plain')

    return NextResponse.json({ summary })
  } catch (error: any) {
    console.error('Error in summarize API:', error)
    const errorMessage = error?.message || 'Failed to generate summary'
    
    // Provide more helpful error messages
    if (errorMessage.includes('Missing Gemini API key') || errorMessage.includes('GEMINI_API_KEY')) {
      return NextResponse.json(
        { error: 'Gemini API key is missing. Please add GEMINI_API_KEY to your .env.local file and restart the server.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

