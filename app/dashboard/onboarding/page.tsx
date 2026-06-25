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
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F0' }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#8B4513', borderBottom: '2px solid #A0522D' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-4 text-white hover:text-orange-100 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span>⚙️</span> AWS User Onboarding Portal
            </h1>
            <p className="text-white text-base mt-2">
              Create users and manage onboarding with real AWS integration
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Demo Mode Banner */}
        <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: '#F8F8FF', border: '2px solid #E8E8F8' }}>
          <p className="text-base font-bold" style={{ color: '#333333' }}>
            <span>📋 Demo Mode:</span> This is a test environment. Feel free to supply your username and email to test the system and receive a confirmation notification. You'll be able to verify the onboarding flow works end-to-end.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Create User Form */}
          <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E0E0E0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CreateUserForm />
          </div>

          {/* Info Panel - How It Works */}
          <div className="rounded-lg p-8" style={{ backgroundColor: '#F8F8FF', border: '2px solid #E8E8F8' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#8B4513' }}>How It Works</h3>
            <div className="space-y-4 text-base" style={{ color: '#333333' }}>
              <div>
                <p className="font-bold mb-1" style={{ color: '#8B4513' }}>1. Fill the Form</p>
                <p className="text-base font-semibold" style={{ color: '#333333' }}>Enter the user's full name, email, and assign them to a group.</p>
              </div>
              <div>
                <p className="font-bold mb-1" style={{ color: '#8B4513' }}>2. Approve & Create</p>
                <p className="text-base font-semibold" style={{ color: '#333333' }}>Click the button to create the user through the API in real-time.</p>
              </div>
              <div>
                <p className="font-bold mb-1" style={{ color: '#8B4513' }}>3. Monitor Audit Logs</p>
                <p className="text-base font-semibold" style={{ color: '#333333' }}>Watch the audit logs below to see exactly what API calls were made and their status.</p>
              </div>
              <div>
                <p className="font-bold mb-1" style={{ color: '#8B4513' }}>4. Multi-Cloud Architecture</p>
                <p className="text-base font-semibold" style={{ color: '#333333' }}>This demo showcases AWS Lambda for hosting modern serverless applications.</p>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mt-8 pt-8" style={{ borderTop: '2px solid #E8E8F8' }}>
              <h4 className="font-bold mb-3 text-base" style={{ color: '#8B4513' }}>Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {['AWS Lambda', 'Next.js', 'TypeScript', 'Terraform', 'Serverless', 'REST API'].map((tech) => (
                  <span
                    key={tech}
                    className="text-white text-sm px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#8B4513' }}
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
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Audit Trail</h2>
          <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E0E0E0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <AuditLogViewer />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20" style={{ backgroundColor: '#8B4513', borderTop: '2px solid #A0522D' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-white text-sm">
          <p>&copy; 2024 Saybaba AWS Onboarding. Built with Next.js and AWS.</p>
        </div>
      </footer>
    </div>
  )
}
