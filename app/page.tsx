import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Admin Panel
        </h1>
        <div className="space-y-4">
          <Link
            href="/admin"
            className="block w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-center"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

