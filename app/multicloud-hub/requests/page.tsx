'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface OnboardingRequest {
  id: string
  employee_name: string
  employee_email: string
  department: string
  job_title: string
  location: string
  status: 'pending' | 'approved' | 'rejected' | 'provisioning' | 'completed'
  created_at: string
  approved_at?: string
}

export default function OnboardingRequests() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [requests, setRequests] = useState<OnboardingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const logged_in = localStorage.getItem('logged_in')
    const user = localStorage.getItem('username')

    if (!logged_in || !user) {
      router.push('/')
      return
    }

    setIsAuthenticated(true)
    fetchRequests()
  }, [router])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/multicloud-hub/requests')
      if (!response.ok) {
        throw new Error('Failed to fetch requests')
      }
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching requests')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the request for ${name}? This cannot be undone.`)) {
      return
    }

    setDeleting(id)
    try {
      const response = await fetch(`/api/multicloud-hub/requests/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete request')
      }

      setRequests(requests.filter((r) => r.id !== id))
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting request')
    } finally {
      setDeleting(null)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/30 border-yellow-600 text-yellow-300'
      case 'approved':
        return 'bg-blue-900/30 border-blue-600 text-blue-300'
      case 'provisioning':
        return 'bg-purple-900/30 border-purple-600 text-purple-300'
      case 'completed':
        return 'bg-green-900/30 border-green-600 text-green-300'
      case 'rejected':
        return 'bg-red-900/30 border-red-600 text-red-300'
      default:
        return 'bg-gray-900/30 border-gray-600 text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'approved':
        return '✅'
      case 'provisioning':
        return '🚀'
      case 'completed':
        return '🎉'
      case 'rejected':
        return '❌'
      default:
        return '📋'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-purple-900 border-b border-blue-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/multicloud-hub"
            className="text-blue-300 hover:text-blue-200 font-semibold transition flex items-center gap-2 mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">All Onboarding Requests</h1>
          <p className="text-blue-200 text-sm mt-2">View all submitted onboarding requests and their status</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* New Request Button */}
        <div className="mb-8">
          <Link
            href="/multicloud-hub/requests/new"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            + Create New Request
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading requests...</p>
          </div>
        )}

        {/* Requests Table */}
        {!loading && requests.length > 0 ? (
          <div className="bg-slate-900 rounded-lg border border-gray-600 overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-6 gap-4 bg-slate-800 border-b border-gray-600 p-4 font-bold text-gray-300 text-sm">
              <div>Employee</div>
              <div>Department</div>
              <div>Job Title</div>
              <div>Location</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-600">
              {requests.map((req) => (
                <div key={req.id} className="p-4 hover:bg-slate-800/50 transition">
                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-3 mb-4">
                    <div>
                      <p className="text-white font-semibold">{req.employee_name}</p>
                      <p className="text-gray-400 text-sm">{req.employee_email}</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">{req.department} • {req.job_title}</p>
                        <p className="text-gray-500 text-xs">{req.location}</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded border ${getStatusColor(
                          req.status
                        )}`}
                      >
                        {getStatusIcon(req.status)} {req.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:grid grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="text-white font-semibold text-sm">{req.employee_name}</p>
                      <p className="text-gray-400 text-xs">{req.employee_email}</p>
                    </div>

                    <div className="text-gray-300 text-sm">{req.department}</div>

                    <div className="text-gray-300 text-sm">{req.job_title}</div>

                    <div className="text-gray-300 text-sm">{req.location}</div>

                    <div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded border inline-block ${getStatusColor(
                          req.status
                        )}`}
                      >
                        {getStatusIcon(req.status)} {req.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/multicloud-hub/requests/${req.id}`}
                        className="text-blue-400 hover:text-blue-300 font-semibold text-sm"
                      >
                        View →
                      </Link>
                      <button
                        onClick={() => handleDelete(req.id, req.employee_name)}
                        disabled={deleting === req.id}
                        className="text-red-400 hover:text-red-300 font-semibold text-sm disabled:text-gray-500"
                      >
                        {deleting === req.id ? '...' : '🗑️'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !loading ? (
          <div className="bg-slate-900 rounded-lg border border-gray-600 p-12 text-center">
            <p className="text-gray-400 text-lg mb-6">No onboarding requests yet</p>
            <Link
              href="/multicloud-hub/requests/new"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              + Create First Request
            </Link>
          </div>
        ) : null}

        {/* Summary */}
        {!loading && requests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
            <div className="bg-slate-900 rounded-lg border border-gray-600 p-4">
              <p className="text-gray-400 text-sm">Total Requests</p>
              <p className="text-3xl font-bold text-white">{requests.length}</p>
            </div>
            <div className="bg-yellow-900/20 rounded-lg border border-yellow-600 p-4">
              <p className="text-yellow-300 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-300">
                {requests.filter((r) => r.status === 'pending').length}
              </p>
            </div>
            <div className="bg-blue-900/20 rounded-lg border border-blue-600 p-4">
              <p className="text-blue-300 text-sm">Approved</p>
              <p className="text-3xl font-bold text-blue-300">
                {requests.filter((r) => r.status === 'approved').length}
              </p>
            </div>
            <div className="bg-green-900/20 rounded-lg border border-green-600 p-4">
              <p className="text-green-300 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-300">
                {requests.filter((r) => r.status === 'completed').length}
              </p>
            </div>
            <div className="bg-red-900/20 rounded-lg border border-red-600 p-4">
              <p className="text-red-300 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-red-300">
                {requests.filter((r) => r.status === 'rejected').length}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
