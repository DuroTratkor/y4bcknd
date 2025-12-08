import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'File Upload & Summarizer',
  description: 'Upload files and get AI summaries',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

