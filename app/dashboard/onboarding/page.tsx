'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CreateUserForm from './components/CreateUserForm'
import AuditLogViewer from './components/AuditLogViewer'

export default function AWSOboardingPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const logged_in = localStorage.getItem('logged_in')
    if (!logged_in) {
      router.push('/')
      return
    }
    setIsAuthenticated(true)
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span>⚙️</span> AWS User Onboarding Portal
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Create users and manage onboarding with real AWS integration
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CreateUserForm />
          <AuditLogViewer />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Saybaba AWS Onboarding. Built with Next.js and AWS.</p>
        </div>
      </footer>
    </div>
  )
}
