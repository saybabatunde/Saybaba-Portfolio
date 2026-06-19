'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import StatusCards from './components/StatusCards'
import MetricsDisplay from './components/MetricsDisplay'
import AlertLog from './components/AlertLog'

export default function MonitoringDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    const logged_in = localStorage.getItem('logged_in')
    if (!logged_in) {
      router.push('/')
      return
    }
    setIsAuthenticated(true)
  }, [router])

  useEffect(() => {
    if (isAuthenticated) {
      setLastUpdated(new Date())
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-4 text-gray-400 hover:text-white flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span>📊</span> Infrastructure Health Dashboard
            </h1>
            <p className="text-gray-300 text-sm mt-2">
              Real-time monitoring of all connected services and resources
            </p>
          </div>
          {lastUpdated && (
            <p className="text-gray-400 text-xs mt-3">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Status Cards - External Services */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-600 pb-3">
            External Services Health
          </h2>
          <StatusCards />
        </section>

        {/* Metrics - Infrastructure */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-600 pb-3">
            Infrastructure Metrics
          </h2>
          <MetricsDisplay />
        </section>

        {/* Alert Log */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-red-500 pb-3">
            Alert History
          </h2>
          <AlertLog />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Saybaba Infrastructure Monitoring. Real-time multi-cloud health dashboard.</p>
        </div>
      </footer>
    </div>
  )
}
