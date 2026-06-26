'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface DeployedResource {
  id: string
  request_id: string
  resource_name: string
  resource_type: string
  size: string
  region: string
  monthly_cost: number
  status: string
  created_at: string
  expires_at: string
  deleted_at?: string
}

interface Request {
  id: string
  user_email: string
  status: string
  created_at: string
  deployed_at: string
}

export default function InfrastructureDashboard() {
  const router = useRouter()
  const [resources, setResources] = useState<DeployedResource[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [totalCost, setTotalCost] = useState(0)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    // For demo, show sample data or allow email input
    const userEmail = localStorage.getItem('user_email') || ''
    setEmail(userEmail)
    if (userEmail) {
      fetchResources(userEmail)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchResources = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/infrastructure/resources?email=${userEmail}`)
      if (!response.ok) throw new Error('Failed to fetch resources')
      const data = await response.json()

      // Auto-delete resources older than 1 hour
      const now = new Date()
      const filteredResources = (data.resources || []).filter((resource: DeployedResource) => {
        const createdTime = new Date(resource.created_at)
        const hoursOld = (now.getTime() - createdTime.getTime()) / (1000 * 60 * 60)
        return hoursOld < 1 // Keep only resources younger than 1 hour
      })

      setResources(filteredResources)
      setRequests(data.requests || [])

      // Calculate total cost
      const total = filteredResources.reduce((sum: number, r: DeployedResource) => sum + r.monthly_cost, 0) || 0
      setTotalCost(total)
    } catch (err) {
      console.error('Error fetching resources:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (resourceId: string, resourceName: string) => {
    if (!confirm(`Are you sure you want to delete ${resourceName}? This will stop all charges immediately.`)) {
      return
    }

    setDeleting(resourceId)
    try {
      const response = await fetch(`/api/infrastructure/resources/${resourceId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete resource')

      // Remove from local state
      setResources(resources.filter((r) => r.id !== resourceId))
      setTotalCost(totalCost - (resources.find((r) => r.id === resourceId)?.monthly_cost || 0))

      alert('Resource deleted successfully. Charges will stop immediately.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resource')
    } finally {
      setDeleting(null)
    }
  }

  const calculateDaysRemaining = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, days)
  }

  const calculateTimeUntilAutoDelete = (createdAt: string) => {
    const now = new Date()
    const created = new Date(createdAt)
    const minutesOld = (now.getTime() - created.getTime()) / (1000 * 60)
    const minutesRemaining = Math.max(0, 60 - Math.floor(minutesOld))
    return minutesRemaining
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <Link
              href="/dashboard"
              className="font-semibold transition duration-200 flex items-center gap-2 text-sm"
              style={{ color: '#0078D4' }}
            >
              ← Main Portfolio
            </Link>
            <Link
              href="/infrastructure-portal"
              className="font-semibold py-2 px-4 rounded-lg transition duration-200 text-white"
              style={{ backgroundColor: '#10B981' }}
            >
              + Request Infrastructure
            </Link>
          </div>

          {/* Dashboard Header */}
          <div className="flex items-center gap-4">
            <span className="text-3xl">📊</span>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#111827' }}>Infrastructure Dashboard</h2>
              <p className="text-sm" style={{ color: '#6B7280' }}>Manage your deployed Azure resources</p>
            </div>
            <button
              onClick={() => window.location.href = '/infrastructure-portal/dashboard'}
              className="ml-auto font-semibold py-2 px-4 rounded-lg transition duration-200 text-white"
              style={{ backgroundColor: '#0078D4' }}
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Warning Banner */}
        <div className="mb-8 rounded-lg p-6" style={{ backgroundColor: '#3BFE4FA', borderLeft: '4px solid #0078D4' }}>
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="font-bold mb-2" style={{ color: '#0C4A6E' }}>Important: Delete Resources to Avoid Billing</h3>
              <p className="text-sm mb-3" style={{ color: '#0C4A6E' }}>
                Kindly delete the resources created to avoid unexpected charges. Each resource incurs real costs to your Azure subscription.
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: '#0C4A6E' }}>
                <li><strong>⏱️ Auto-delete:</strong> Resources automatically deleted after 1 hour</li>
                <li><strong>💰 Manual delete:</strong> Click "🗑 Delete Resource" button to delete immediately</li>
                <li><strong>📧 Notifications:</strong> Email confirmation sent when resource is deleted</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cost Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #0078D4' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Total Resources</p>
            <p className="text-4xl font-bold" style={{ color: '#0078D4' }}>{resources.length}</p>
            <p className="text-xs mt-2" style={{ color: '#6B7280' }}>Active deployments</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #10B981' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Monthly Cost</p>
            <p className="text-4xl font-bold" style={{ color: '#10B981' }}>${totalCost.toFixed(2)}</p>
            <p className="text-xs mt-2" style={{ color: '#6B7280' }}>Estimated total</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #F59E0B' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Budget Alert</p>
            <p className="text-4xl font-bold" style={{ color: '#F59E0B' }}>$50</p>
            <p className="text-xs mt-2" style={{ color: '#6B7280' }}>Monthly limit</p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border-l-4 border-red-500 p-6 mb-8" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {!email ? (
          <div className="rounded-lg p-12" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #0078D4' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#111827' }}>Enter Your Email</h2>
            <p className="mb-6" style={{ color: '#6B7280' }}>Enter the email you used to request infrastructure to view your resources:</p>

            <div className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none transition"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  color: '#111827',
                }}
              />
              <button
                onClick={() => {
                  if (email) {
                    localStorage.setItem('user_email', email)
                    fetchResources(email)
                  }
                }}
                className="font-bold py-3 px-6 rounded-lg transition text-white"
                style={{ backgroundColor: '#0078D4' }}
              >
                Load Resources
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <p style={{ color: '#6B7280' }} className="text-lg">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="rounded-lg p-12 text-center" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #0078D4' }}>
            <p className="text-lg mb-6" style={{ color: '#6B7280' }}>No deployed resources yet</p>
            <Link
              href="/infrastructure-portal"
              className="inline-block font-semibold py-3 px-6 rounded-lg transition duration-200 text-white"
              style={{ backgroundColor: '#10B981' }}
            >
              Request Infrastructure →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {resources.map((resource) => {
              const minutesRemaining = calculateTimeUntilAutoDelete(resource.created_at)

              return (
                <div
                  key={resource.id}
                  className="rounded-lg p-6 hover:shadow-lg transition"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderLeft: '4px solid #0078D4',
                  }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>
                        {resource.resource_name}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                        Created: {new Date(resource.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold" style={{ color: '#10B981' }}>
                        ${resource.monthly_cost.toFixed(2)}
                      </p>
                      <p className="text-sm" style={{ color: '#6B7280' }}>/month</p>
                    </div>
                  </div>

                  {/* Resource Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '1.5rem' }}>
                    <div className="rounded p-4" style={{ backgroundColor: '#F9FAFB' }}>
                      <p className="text-xs font-semibold" style={{ color: '#6B7280' }}>Type</p>
                      <p className="font-bold mt-1" style={{ color: '#111827' }}>
                        {resource.resource_type}
                      </p>
                    </div>
                    <div className="rounded p-4" style={{ backgroundColor: '#F9FAFB' }}>
                      <p className="text-xs font-semibold" style={{ color: '#6B7280' }}>Size</p>
                      <p className="font-bold mt-1" style={{ color: '#111827' }}>
                        {resource.size}
                      </p>
                    </div>
                    <div className="rounded p-4" style={{ backgroundColor: '#F9FAFB' }}>
                      <p className="text-xs font-semibold" style={{ color: '#6B7280' }}>Region</p>
                      <p className="font-bold mt-1" style={{ color: '#111827' }}>
                        {resource.region}
                      </p>
                    </div>
                    <div className="rounded p-4" style={{ backgroundColor: '#F9FAFB' }}>
                      <p className="text-xs font-semibold" style={{ color: '#6B7280' }}>Status</p>
                      <p className="font-bold mt-1" style={{ color: '#10B981' }}>
                        ● {resource.status}
                      </p>
                    </div>
                  </div>

                  {/* Auto-Delete Warning */}
                  <div className="rounded p-4 mb-6" style={{ backgroundColor: '#FEF3C7', borderLeft: '4px solid #F59E0B' }}>
                    <p className="font-bold" style={{ color: '#92400E' }}>
                      ⏰ Auto-deletes in {minutesRemaining} minutes
                    </p>
                    <p className="text-sm mt-2" style={{ color: '#92400E' }}>
                      Delete now to stop charges immediately, or it will auto-delete after 1 hour
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDelete(resource.id, resource.resource_name)}
                      disabled={deleting === resource.id}
                      className="flex-1 font-bold py-2 px-4 rounded-lg transition duration-200 text-white"
                      style={{
                        backgroundColor: deleting === resource.id ? '#D1D5DB' : '#EF4444',
                      }}
                    >
                      {deleting === resource.id ? 'Deleting...' : '🗑 Delete Resource'}
                    </button>
                    <button
                      onClick={() => router.push(`/infrastructure-portal`)}
                      className="flex-1 font-bold py-2 px-4 rounded-lg transition duration-200 text-white"
                      style={{ backgroundColor: '#6B7280' }}
                    >
                      📋 View Details
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Cost Controls Info */}
        <div className="mt-12 rounded-lg p-8" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #0078D4' }}>
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#111827' }}>💡 About Cost Controls</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: '📅', title: '30-Day Auto-Expiry', desc: 'Resources automatically deleted after 30 days' },
              { icon: '📧', title: 'Email Reminders', desc: 'Notification sent 5 days before expiration' },
              { icon: '💰', title: 'Budget Alert', desc: 'Alert triggered if costs exceed $50/month' },
              { icon: '🗑️', title: 'Immediate Deletion', desc: 'Delete anytime to stop charges instantly' },
              { icon: '📊', title: 'Cost Estimates', desc: 'Calculated at deployment time' },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-lg p-4"
                style={{ backgroundColor: '#F0F9FF', borderLeft: '3px solid #0078D4' }}
              >
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="font-bold mb-1" style={{ color: '#111827' }}>
                  {item.title}
                </p>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
