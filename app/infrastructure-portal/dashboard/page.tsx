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
      setResources(data.resources || [])
      setRequests(data.requests || [])

      // Calculate total cost
      const total = data.resources?.reduce((sum: number, r: DeployedResource) => sum + r.monthly_cost, 0) || 0
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

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-cyan-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="text-blue-400 hover:text-blue-300 font-semibold transition duration-200 flex items-center gap-2"
          >
            ← Back to Dashboard
          </Link>
          <Link
            href="/infrastructure-portal"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            + Request Infrastructure
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Infrastructure Dashboard</h1>
          <p className="text-gray-300">Manage your deployed Azure resources and monitor costs</p>
        </div>

        {/* Cost Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-cyan-500 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Resources</p>
            <p className="text-4xl font-bold text-cyan-400">{resources.length}</p>
            <p className="text-gray-500 text-xs mt-2">Active deployments</p>
          </div>

          <div className="bg-slate-900 border border-green-500 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Monthly Cost</p>
            <p className="text-4xl font-bold text-green-400">${totalCost.toFixed(2)}</p>
            <p className="text-gray-500 text-xs mt-2">Estimated total</p>
          </div>

          <div className="bg-slate-900 border border-blue-500 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Budget Alert</p>
            <p className="text-4xl font-bold text-blue-400">$50</p>
            <p className="text-gray-500 text-xs mt-2">Monthly limit</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {!email ? (
          <div className="bg-slate-900 rounded-lg border border-gray-600 p-12">
            <h2 className="text-2xl font-bold text-white mb-6">Enter Your Email</h2>
            <p className="text-gray-300 mb-6">Enter the email you used to request infrastructure to view your resources:</p>

            <div className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => {
                  if (email) {
                    localStorage.setItem('user_email', email)
                    fetchResources(email)
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Load Resources
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-slate-900 rounded-lg border border-gray-600 p-12 text-center">
            <p className="text-gray-400 text-lg mb-6">No deployed resources yet</p>
            <Link
              href="/infrastructure-portal"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Request Infrastructure →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {resources.map((resource) => {
              const daysRemaining = calculateDaysRemaining(resource.expires_at)
              const isExpiringSoon = daysRemaining <= 5

              return (
                <div key={resource.id} className="bg-slate-900 rounded-lg border border-cyan-500 p-6 hover:border-cyan-400 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{resource.resource_name}</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Created: {new Date(resource.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-400">${resource.monthly_cost.toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">/month</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-800 p-3 rounded">
                      <p className="text-gray-400 text-xs">Type</p>
                      <p className="text-white font-semibold capitalize">{resource.resource_type}</p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded">
                      <p className="text-gray-400 text-xs">Size</p>
                      <p className="text-white font-semibold">{resource.size}</p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded">
                      <p className="text-gray-400 text-xs">Region</p>
                      <p className="text-white font-semibold capitalize">{resource.region}</p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded">
                      <p className="text-gray-400 text-xs">Status</p>
                      <p className="text-white font-semibold capitalize">
                        <span className="text-green-400">● </span>
                        {resource.status}
                      </p>
                    </div>
                  </div>

                  {/* Expiration Warning */}
                  <div className={`p-3 rounded mb-4 ${isExpiringSoon ? 'bg-yellow-900/30 border border-yellow-600' : 'bg-slate-800 border border-gray-600'}`}>
                    <p className={isExpiringSoon ? 'text-yellow-300' : 'text-gray-300'}>
                      ⏱ Expires in {daysRemaining} days • Auto-cleanup enabled
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDelete(resource.id, resource.resource_name)}
                      disabled={deleting === resource.id}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      {deleting === resource.id ? 'Deleting...' : '🗑 Delete Resource'}
                    </button>
                    <button
                      onClick={() => router.push(`/infrastructure-portal`)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      📋 View Details
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Budget Alert Info */}
        <div className="mt-12 bg-blue-900/20 border border-blue-500 rounded-lg p-6 text-blue-100">
          <h3 className="font-bold mb-2">💡 About Cost Controls</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Resources auto-expire after 30 days to prevent unexpected charges</li>
            <li>Email reminder sent when 5 days remain before expiration</li>
            <li>Budget alert triggered if monthly costs exceed $50</li>
            <li>Delete resources immediately to stop charges</li>
            <li>All cost estimates calculated at deployment time</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
