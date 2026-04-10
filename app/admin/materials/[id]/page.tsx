'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface FileMetadata {
  id: number
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  uploaded_at: string
}

async function extractTextFromPdf(fileBlob: Blob) {
  const pdfjs = await import('pdfjs-dist')
  if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString()
  }

  const arrayBuffer = await fileBlob.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
  let text = ''

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    const pageText = content.items.map((item: any) => ('str' in item ? item.str : '')).join(' ')
    text += pageText + '\n'
  }

  return text.trim()
}

async function blobToText(meta: FileMetadata, blob: Blob) {
  const lower = meta.file_name.toLowerCase()
  if (lower.endsWith('.pdf') || meta.file_type === 'application/pdf') {
    return extractTextFromPdf(blob)
  }

  if (lower.endsWith('.docx') || lower.endsWith('.doc')) {
    throw new Error('Word documents (.docx, .doc) are not supported. Please convert to .pdf or .txt.')
  }

  if (meta.file_type.startsWith('image/')) {
    return `[Image file: ${meta.file_name}]`
  }

  try {
    return await blob.text()
  } catch {
    throw new Error(`File type "${meta.file_type}" is not supported for text extraction.`)
  }
}

export default function MaterialSummaryPage() {
  const params = useParams()
  const router = useRouter()
  const id = useMemo(() => Number(params?.id), [params])

  const [meta, setMeta] = useState<FileMetadata | null>(null)
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoadingMeta(true)
      setError(null)
      try {
        if (!Number.isFinite(id)) throw new Error('Invalid material id')
        const { data, error } = await supabase.from('file_metadata').select('*').eq('id', id).single()
        if (error) throw error
        if (!cancelled) setMeta(data as FileMetadata)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load material')
      } finally {
        if (!cancelled) setLoadingMeta(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [id])

  const generateSummary = async () => {
    if (!meta) return
    setLoadingSummary(true)
    setError(null)
    setSummary(null)
    try {
      const { data: fileBlob, error: downloadError } = await supabase.storage
        .from('files')
        .download(meta.file_path)
      if (downloadError) throw downloadError

      const fileContent = await blobToText(meta, fileBlob)

      const resp = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileContent,
          fileName: meta.file_name,
          mimeType: meta.file_type,
        }),
      })
      const payload = await resp.json()
      if (!resp.ok) throw new Error(payload?.error || 'Failed to generate summary')

      setSummary(payload.summary)
    } catch (e: any) {
      setError(e?.message || 'Failed to generate summary')
    } finally {
      setLoadingSummary(false)
    }
  }

  useEffect(() => {
    if (meta && !summary && !loadingSummary) {
      generateSummary()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">Material Summary</h1>
              {meta ? (
                <p className="text-gray-700 mt-1 truncate">{meta.file_name}</p>
              ) : (
                <p className="text-gray-600 mt-1">Loading…</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-50"
              >
                ← Admin
              </button>
              <Link href="/" className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-50">
                Home
              </Link>
            </div>
          </div>

          {error ? (
            <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded-lg">{error}</div>
          ) : null}

          {loadingMeta ? (
            <div className="text-gray-600">Loading material…</div>
          ) : meta ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-200 rounded-xl p-4">
                <div className="text-sm text-gray-700">
                  <div>
                    <span className="font-semibold">Type:</span> {meta.file_type || 'unknown'}
                  </div>
                  <div>
                    <span className="font-semibold">Size:</span> {(meta.file_size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  type="button"
                  onClick={generateSummary}
                  disabled={loadingSummary}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition"
                >
                  {loadingSummary ? 'Summarizing…' : 'Summarize again'}
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Summary</h2>
                {loadingSummary ? (
                  <div className="text-gray-600">Generating summary…</div>
                ) : summary ? (
                  <div className="whitespace-pre-wrap text-gray-900">{summary}</div>
                ) : (
                  <div className="text-gray-600">No summary yet.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-gray-600">Material not found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

