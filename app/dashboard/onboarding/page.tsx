'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CreateUserForm from '@/components/onboarding/CreateUserForm'
import AuditLogViewer from '@/components/onboarding/AuditLogViewer'

export default function UserOnboardingPage() {
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
          <div className="flex justify-between items-center">
            <div>
              <Link
                href="/dashboard"
                className="text-blue-400 hover:text-blue-300 font-semibold transition duration-200 flex items-center gap-2 mb-2"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-white">User Onboarding Portal</h1>
              <p className="text-gray-400 text-sm mt-1">AWS IAM User Management Demo</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Info Banner */}
        <div className="mb-8 p-4 bg-blue-900/30 border border-blue-600 rounded-lg">
          <p className="text-blue-300">
            <span className="font-semibold">Demo Mode:</span> This demo creates real IAM users in AWS. After testing, you can delete users from the AWS console. All actions are logged below.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Create User Form */}
          <div>
            <CreateUserForm />
          </div>

          {/* Info Panel */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
            <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
            <div className="space-y-4 text-gray-300">
              <div>
                <p className="font-semibold text-white mb-1">1. Fill the Form</p>
                <p className="text-sm">Enter the user's full name, email, and assign them to an IAM group.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">2. Approve & Create</p>
                <p className="text-sm">Click the button to create the IAM user in your AWS account in real-time.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">3. Monitor Audit Logs</p>
                <p className="text-sm">Watch the audit logs below to see exactly what API calls were made and their status.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">4. Verify in AWS</p>
                <p className="text-sm">Go to AWS IAM console to verify the user was created with the correct permissions.</p>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h4 className="font-semibold text-white mb-3">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {['AWS Lambda', 'API Gateway', 'DynamoDB', 'IAM', 'Next.js', 'TypeScript', 'Terraform'].map((tech) => (
                  <span
                    key={tech}
                    className="bg-gray-700 text-blue-300 text-xs px-3 py-1 rounded-full"
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
          <h2 className="text-2xl font-bold text-white mb-6">Audit Trail</h2>
          <AuditLogViewer />
        </div>

        {/* GitHub Link */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Want to see the code behind this demo?
          </p>
          <a
            href="https://github.com/saybabatunde/Saybaba-Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            View on GitHub →
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Saybaba. Built with Next.js, AWS, and Terraform.</p>
        </div>
      </footer>
    </div>
  )
}
