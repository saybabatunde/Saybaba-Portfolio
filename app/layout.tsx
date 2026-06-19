import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Saybaba Portfolio',
  description: 'Saybaba - Cloud Infrastructure & Full Stack Developer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-blue-50 text-gray-100">{children}</body>
    </html>
  )
}
