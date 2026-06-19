'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CreateUserForm from './components/CreateUserForm'
import AuditLogViewer from './components/AuditLogViewer'

export default function AzureOnboardingPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const logged_in = localStorage.getItem('logged_in')
    const user = localStorage.getItem('username')

    if (!logged_in || !user) {
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
    <div className="min-h-screen bg-slate-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-600 to-blue-700 border-b border-cyan-400 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link
                href="/dashboard"
                className="text-black hover:text-cyan-100 font-semibold transition duration-200 flex items-center gap-2 mb-2"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-black">Azure User Onboarding Portal</h1>
              <p className="text-black text-sm mt-1">Multi-Cloud Demo on Azure Static Web Apps</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Info Banner */}
        <div className="mb-8 p-4 bg-slate-400 border border-cyan-400 rounded-lg">
          <p className="text-black text-sm">
            <span className="font-semibold">Demo Mode:</span> This demo showcases Azure Static Web Apps deployment. Frontend hosted on Azure with serverless architecture. All actions are logged below.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Create User Form */}
          <div className="bg-blue-900 rounded-lg p-6 border border-blue-700">
            <CreateUserForm />
          </div>

          {/* Info Panel */}
          <div className="bg-slate-400 rounded-lg border border-cyan-400 p-8">
            <h3 className="text-xl font-bold text-black mb-4">How It Works</h3>
            <div className="space-y-4 text-black">
              <div>
                <p className="font-semibold text-black mb-1">1. Fill the Form</p>
                <p className="text-sm">Enter the user's full name, email, and assign them to a group.</p>
              </div>
              <div>
                <p className="font-semibold text-black mb-1">2. Approve & Create</p>
                <p className="text-sm">Click the button to create the user through the API in real-time.</p>
              </div>
              <div>
                <p className="font-semibold text-black mb-1">3. Monitor Audit Logs</p>
                <p className="text-sm">Watch the audit logs below to see exactly what API calls were made and their status.</p>
              </div>
              <div>
                <p className="font-semibold text-black mb-1">4. Multi-Cloud Architecture</p>
                <p className="text-sm">This demo showcases Azure Static Web Apps for hosting modern serverless applications.</p>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mt-8 pt-8 border-t border-cyan-400">
              <h4 className="font-semibold text-black mb-3">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {['Azure Static Web Apps', 'Next.js', 'TypeScript', 'Terraform', 'Serverless', 'REST API'].map((tech) => (
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
          <AuditLogViewer />
        </div>

        {/* GitHub Link */}
        <div className="mt-12 text-center">
          <p className="text-black mb-4">
            Want to see the code behind this demo?
          </p>
          <a
            href="https://github.com/saybabatunde/Saybaba-Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white700 hover:bg-white600 text-black font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            View on GitHub →
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-cyan-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-black text-sm">
          <p>&copy; 2024 Saybaba. Built with Next.js, Azure, and Terraform.</p>
        </div>
      </footer>
    </div>
  )
}
