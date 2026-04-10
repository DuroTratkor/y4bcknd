'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface FileMetadata {
  id: number
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  uploaded_at: string
}

export default function AdminPage() {
  const router = useRouter()

  // Materials state
  const [materials, setMaterials] = useState<FileMetadata[]>([])
  const [materialsLoading, setMaterialsLoading] = useState(true)
  const [materialsError, setMaterialsError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [activeMaterial, setActiveMaterial] = useState<FileMetadata | null>(null)

  const refreshMaterials = async () => {
    setMaterialsLoading(true)
    setMaterialsError(null)
    try {
      const { data, error } = await supabase
        .from('file_metadata')
        .select('*')
        .order('uploaded_at', { ascending: false })
      if (error) throw error
      setMaterials((data as FileMetadata[]) || [])
    } catch (e: any) {
      setMaterialsError(e?.message || 'Failed to load materials')
    } finally {
      setMaterialsLoading(false)
    }
  }

  useEffect(() => {
    refreshMaterials()
  }, [])

  const handleMaterialsUpload = async () => {
    if (!uploadFile) return
    setUploading(true)
    setMaterialsError(null)
    try {
      const fileExt = uploadFile.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `uploads/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, uploadFile, { cacheControl: '3600', upsert: false })
      if (uploadError) throw uploadError

      const { error: dbError } = await supabase.from('file_metadata').insert([
        {
          file_name: uploadFile.name,
          file_path: filePath,
          file_size: uploadFile.size,
          file_type: uploadFile.type,
          uploaded_at: new Date().toISOString(),
        },
      ])
      if (dbError) throw dbError

      setUploadFile(null)
      const fileInput = document.getElementById('admin-file-input') as HTMLInputElement | null
      if (fileInput) fileInput.value = ''
      await refreshMaterials()
    } catch (e: any) {
      setMaterialsError(e?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMaterial = async (m: FileMetadata) => {
    setMaterialsError(null)
    try {
      const { error: storageError } = await supabase.storage.from('files').remove([m.file_path])
      if (storageError) throw storageError

      const { error: dbError } = await supabase.from('file_metadata').delete().eq('id', m.id)
      if (dbError) throw dbError

      setMaterials((prev) => prev.filter((x) => x.id !== m.id))
      setActiveMaterial((cur) => (cur?.id === m.id ? null : cur))
    } catch (e: any) {
      setMaterialsError(e?.message || 'Failed to delete material')
    }
  }

  const goToSummary = (m: FileMetadata) => {
    router.push(`/admin/materials/${m.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your learning materials.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-indigo-700 hover:text-indigo-900 font-medium">
                ← Home
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 border border-gray-200 rounded-xl p-5">
                <h2 className="text-lg font-semibold text-gray-900">Add material</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Uploads to Supabase Storage bucket <span className="font-medium">files</span> and inserts into{' '}
                  <span className="font-medium">file_metadata</span>.
                </p>

                <div className="mt-4 space-y-3">
                  <input
                    id="admin-file-input"
                    type="file"
                    disabled={uploading}
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  <button
                    onClick={handleMaterialsUpload}
                    disabled={!uploadFile || uploading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition"
                  >
                    {uploading ? 'Uploading…' : 'Upload'}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2 border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">All materials</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {materials.length} item{materials.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <button
                    onClick={refreshMaterials}
                    className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-50"
                  >
                    Refresh
                  </button>
                </div>

                {materialsError ? (
                  <div className="mt-4 bg-red-50 text-red-800 border border-red-200 p-3 rounded-lg">
                    {materialsError}
                  </div>
                ) : null}

                {materialsLoading ? (
                  <div className="mt-6 text-gray-600">Loading…</div>
                ) : (
                  <div className="mt-4 divide-y divide-gray-100 border border-gray-100 rounded-lg">
                    {materials.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setActiveMaterial(m)}
                        className="w-full text-left p-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition"
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{m.file_name}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {(m.file_size / 1024).toFixed(1)} KB · {m.file_type || 'unknown'} ·{' '}
                            {new Date(m.uploaded_at).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 break-all">{m.file_path}</div>
                        </div>
                        <div className="shrink-0 text-xs font-semibold text-gray-500">Manage →</div>
                      </button>
                    ))}
                    {!materials.length ? <div className="p-4 text-gray-600">No materials yet.</div> : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeMaterial ? (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActiveMaterial(null)
          }}
        >
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{activeMaterial.file_name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {(activeMaterial.file_size / 1024).toFixed(1)} KB · {activeMaterial.file_type || 'unknown'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMaterial(null)}
                className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => goToSummary(activeMaterial)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition"
              >
                Summarize
              </button>
              <button
                type="button"
                onClick={() => handleDeleteMaterial(activeMaterial)}
                className="flex-1 border border-red-200 text-red-700 hover:bg-red-50 font-semibold py-2.5 px-4 rounded-lg transition"
              >
                Delete material
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

