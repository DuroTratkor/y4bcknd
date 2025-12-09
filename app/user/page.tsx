'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface FileMetadata {
  id: number
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  uploaded_at: string
}

export default function UserPage() {
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null)
  const [summarizing, setSummarizing] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('file_metadata')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (err: any) {
      console.error('Error fetching files:', err)
      setError('Failed to fetch files')
    } finally {
      setLoading(false)
    }
  }

  const handleSummarize = async (file: FileMetadata) => {
    setSelectedFile(file)
    setSummarizing(true)
    setSummary(null)
    setError(null)

    try {
      // Download file from Supabase Storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('files')
        .download(file.file_path)

      if (downloadError) throw downloadError

      // Convert file to text based on type
      let fileContent = ''
      const fileName = file.file_name.toLowerCase()
      
      // Check for unsupported binary formats
      if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        throw new Error('Word documents (.docx, .doc) are not supported. Please convert to .txt or .pdf first.')
      }
      
      if (fileName.endsWith('.pdf')) {
        throw new Error('PDF files are not directly supported for text extraction. Please convert to .txt first, or use a PDF text extraction tool.')
      }
      
      if (file.file_type.startsWith('text/') || 
          file.file_type === 'application/json' ||
          file.file_type === 'application/javascript' ||
          file.file_type === 'application/xml' ||
          fileName.endsWith('.txt') ||
          fileName.endsWith('.md') ||
          fileName.endsWith('.js') ||
          fileName.endsWith('.ts') ||
          fileName.endsWith('.py') ||
          fileName.endsWith('.java') ||
          fileName.endsWith('.cpp') ||
          fileName.endsWith('.c') ||
          fileName.endsWith('.html') ||
          fileName.endsWith('.css') ||
          fileName.endsWith('.json') ||
          fileName.endsWith('.xml') ||
          fileName.endsWith('.csv')) {
        fileContent = await fileData.text()
      } else if (file.file_type.startsWith('image/')) {
        // For images, we'll just note it's an image file
        // Note: Gemini can handle images, but for simplicity we'll use text description
        fileContent = `[Image file: ${file.file_name}]`
      } else {
        // Try to read as text anyway
        try {
          fileContent = await fileData.text()
        } catch {
          throw new Error(`File type "${file.file_type}" is not supported. Please upload a text file (.txt, .md, .js, .py, etc.) or convert your file to text format first.`)
        }
      }

      // Call API route to summarize
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileContent,
          fileName: file.file_name,
          mimeType: file.file_type,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate summary')
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (err: any) {
      console.error('Error summarizing file:', err)
      setError(err.message || 'Failed to generate summary')
    } finally {
      setSummarizing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Your Files</h1>
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Home
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading files...</p>
            </div>
          ) : error && !files.length ? (
            <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded-lg">
              {error}
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No files uploaded yet.</p>
              <Link
                href="/upload"
                className="text-indigo-600 hover:text-indigo-800 font-medium mt-2 inline-block"
              >
                Upload your first file →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Uploaded Files ({files.length})
                </h2>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">
                            {file.file_name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {(file.file_size / 1024).toFixed(2)} KB •{' '}
                            {new Date(file.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSummarize(file)}
                          disabled={summarizing}
                          className="ml-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
                        >
                          {summarizing && selectedFile?.id === file.id
                            ? 'Summarizing...'
                            : 'Summarize'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedFile && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Summary: {selectedFile.file_name}
                  </h2>
                  {summarizing ? (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <p className="text-gray-600">Generating summary...</p>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded-lg">
                      {error}
                    </div>
                  ) : summary ? (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                      <div className="prose max-w-none">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {summary}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

