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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
        <p style={{ color: '#6B7280' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }} className="sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-6 flex items-center gap-2 font-medium transition"
            style={{ color: '#6366F1' }}
          >
            ← Back to Dashboard
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3" style={{ color: '#111827' }}>
                <span>📊</span> Infrastructure Health Dashboard
              </h1>
              <p style={{ color: '#6B7280' }}>
                Real-time monitoring of all connected services and resources
              </p>
            </div>
            {lastUpdated && (
              <div className="text-right">
                <p className="text-xs font-semibold" style={{ color: '#6B7280' }}>Last updated</p>
                <p className="text-sm font-mono" style={{ color: '#111827' }}>{lastUpdated.toLocaleTimeString()}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Status Cards - External Services */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>External Services Health</h2>
            <p style={{ color: '#6B7280' }}>Status of all connected third-party services</p>
          </div>
          <StatusCards />
        </section>

        {/* Metrics - Infrastructure */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>Infrastructure Metrics</h2>
            <p style={{ color: '#6B7280' }}>Real-time performance and usage metrics</p>
          </div>
          <MetricsDisplay />
        </section>

        {/* Alert Log */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>Alert History</h2>
            <p style={{ color: '#6B7280' }}>Recent system alerts and resolutions</p>
          </div>
          <AlertLog />
        </section>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7EB' }} className="mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm" style={{ color: '#9CA3AF' }}>
          <p>&copy; 2024 Saybaba Infrastructure Monitoring. Real-time multi-cloud health dashboard.</p>
        </div>
      </footer>
    </div>
  )
}
