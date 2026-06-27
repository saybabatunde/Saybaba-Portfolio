import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Saybaba Portfolio',
  description: 'Saybaba - Cloud Infrastructure & Full Stack Developer',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75" fill="%232563EB">⚙️</text></svg>'
  }
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
