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
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-black">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-700 border-b border-orange-400 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-4 text-black hover:text-orange-100 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-black flex items-center gap-3">
              <span>⚙️</span> AWS User Onboarding Portal
            </h1>
            <p className="text-black text-base mt-2">
              Create users and manage onboarding with real AWS integration
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Demo Mode Banner */}
        <div className="mb-8 p-4 bg-orange-600 border border-orange-500 rounded-lg">
          <p className="text-black text-sm">
            <span>📋 Demo Mode:</span> This is a test environment. Feel free to supply your username and email to test the system and receive a confirmation notification. You'll be able to verify the onboarding flow works end-to-end.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Create User Form */}
          <div className="bg-orange-900 rounded-lg p-6 border border-orange-700">
            <CreateUserForm />
          </div>

          {/* Info Panel - How It Works */}
          <div className="bg-orange-600 rounded-lg border border-orange-400 p-8">
            <h3 className="text-xl font-bold text-black mb-4">How It Works</h3>
            <div className="space-y-4 text-black text-base">
              <div>
                <p className="font-semibold text-black mb-1">1. Fill the Form</p>
                <p className="text-base">Enter the user's full name, email, and assign them to a group.</p>
              </div>
              <div>
                <p className="font-semibold text-black mb-1">2. Approve & Create</p>
                <p className="text-base">Click the button to create the user through the API in real-time.</p>
              </div>
              <div>
                <p className="font-semibold text-black mb-1">3. Monitor Audit Logs</p>
                <p className="text-base">Watch the audit logs below to see exactly what API calls were made and their status.</p>
              </div>
              <div>
                <p className="font-semibold text-black mb-1">4. Multi-Cloud Architecture</p>
                <p className="text-base">This demo showcases AWS Lambda for hosting modern serverless applications.</p>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mt-8 pt-8 border-t border-orange-400">
              <h4 className="font-semibold text-black mb-3 text-base">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {['AWS Lambda', 'Next.js', 'TypeScript', 'Terraform', 'Serverless', 'REST API'].map((tech) => (
                  <span
                    key={tech}
                    className="bg-white700 text-white text-sm px-3 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div>
          <h2 className="text-2xl font-bold text-black mb-6">Audit Trail</h2>
          <div className="bg-orange-900 rounded-lg p-6 border border-orange-700">
            <AuditLogViewer />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-cyan-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-black text-sm">
          <p>&copy; 2024 Saybaba AWS Onboarding. Built with Next.js and AWS.</p>
        </div>
      </footer>
    </div>
  )
}
