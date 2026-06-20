'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TestPage() {
  const [email, setEmail] = useState('olawalebabatunde98@gmail.com')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleCreateTestResource = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/infrastructure/test-seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create test resource')
      }

      const data = await response.json()
      // Store email so dashboard can fetch resources
      localStorage.setItem('user_email', email)
      setMessage(`✅ Test resource created! Name: ${data.resourceName}. Redirecting to dashboard...`)
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/infrastructure-portal/dashboard'
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-cyan-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/infrastructure-portal/dashboard"
            className="text-blue-400 hover:text-blue-300 font-semibold transition duration-200 flex items-center gap-2"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Test Infrastructure Portal</h1>
          <p className="text-gray-300">Create a mock resource to test the delete flow</p>
        </div>

        <div className="bg-slate-900 rounded-lg border border-cyan-500 p-8 space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            />
            <p className="text-gray-400 text-sm mt-2">This email will be used for the test resource</p>
          </div>

          {message && (
            <div className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleCreateTestResource}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            {loading ? 'Creating...' : '✅ Create Test Resource'}
          </button>

          <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4 text-blue-100 space-y-2">
            <h3 className="font-bold">What This Does:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Creates a mock deployed resource in your database</li>
              <li>Resource appears on dashboard as "vm-B1s-test-demo"</li>
              <li>Monthly cost: $0 (free tier)</li>
              <li>Now you can test the DELETE button</li>
            </ol>
          </div>

          <Link
            href="/infrastructure-portal/dashboard"
            className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 text-center"
          >
            → Go to Dashboard
          </Link>

          <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 text-yellow-200 text-sm">
            ⚠️ <strong>Test Mode:</strong> This creates a mock resource. Real Terraform provisioning will be wired up next.
          </div>
        </div>
      </main>
    </div>
  )
}
