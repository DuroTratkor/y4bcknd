import { NextRequest, NextResponse } from 'next/server'

// Force Node.js runtime (not Edge) for pdf-parse
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Parse PDF - configure worker before using pdf-parse
    const path = require('path')
    const fs = require('fs')
    
    // Find the actual worker file path
    let workerPath = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.mjs')
    if (!fs.existsSync(workerPath)) {
      // Try alternative path
      workerPath = path.join(process.cwd(), 'node_modules', 'pdf-parse', 'dist', 'pdf-parse', 'esm', 'pdf.worker.mjs')
      if (!fs.existsSync(workerPath)) {
        // Last resort - use empty string
        workerPath = ''
      }
    }
    
    // Set up global pdfjs first
    try {
      const pdfjs = require('pdfjs-dist')
      if (pdfjs && pdfjs.GlobalWorkerOptions) {
        pdfjs.GlobalWorkerOptions.workerSrc = workerPath || ''
      }
    } catch (e) {
      // Ignore if pdfjs-dist can't be loaded
    }
    
    // Now require pdf-parse
    const pdfParse = require('pdf-parse')
    const PDFParse = pdfParse.PDFParse || pdfParse
    
    // Set worker using PDFParse.setWorker
    // Use the actual file path if found, otherwise empty string
    if (typeof PDFParse.setWorker === 'function') {
      PDFParse.setWorker(workerPath || '')
    }
    
    // Create instance and get text
    const parser = new PDFParse({ data: buffer, verbosity: 0 })
    const data = await parser.getText()
    
    return NextResponse.json({ 
      text: data.text,
      pages: data.total,
      info: null
    })
  } catch (error: any) {
    console.error('Error parsing PDF:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to parse PDF' },
      { status: 500 }
    )
  }
}

