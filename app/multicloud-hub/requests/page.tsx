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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
        <p style={{ color: '#6B7280' }}>Loading...</p>
      </div>
    )
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' }
      case 'approved':
        return { bg: '#DCFCE7', border: '#10B981', text: '#166534' }
      case 'provisioning':
        return { bg: '#F3E8FF', border: '#A855F7', text: '#6D28D9' }
      case 'completed':
        return { bg: '#CFFAFE', border: '#06B6D4', text: '#164E63' }
      case 'rejected':
        return { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' }
      default:
        return { bg: '#F3F4F6', border: '#9CA3AF', text: '#374151' }
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
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }} className="sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link
            href="/multicloud-hub"
            className="inline-flex items-center gap-2 mb-6 font-medium transition"
            style={{ color: '#6366F1' }}
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#111827' }}>All Onboarding Requests</h1>
          <p style={{ color: '#6B7280' }}>View all submitted onboarding requests and their status</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* New Request Button */}
        <div className="mb-8">
          <Link
            href="/multicloud-hub/requests/new"
            className="inline-block font-semibold py-3 px-6 rounded-lg transition text-white"
            style={{
              backgroundColor: '#10B981',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10B981')}
          >
            + Create New Request
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border-l-4 p-6 mb-8" style={{ backgroundColor: '#FEF2F2', borderColor: '#EF4444', color: '#7F1D1D' }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p style={{ color: '#6B7280' }}>Loading requests...</p>
          </div>
        )}

        {/* Requests Grid */}
        {!loading && requests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {requests.map((req) => {
              const statusStyle = getStatusBg(req.status)
              return (
                <div
                  key={req.id}
                  className="rounded-lg border-2 p-6 transition hover:shadow-lg"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5E7EB',
                  }}
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1"
                      style={{
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                        borderColor: statusStyle.border,
                      }}
                    >
                      {getStatusIcon(req.status)} {req.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Employee Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-1" style={{ color: '#111827' }}>
                      {req.employee_name}
                    </h3>
                    <p className="text-sm" style={{ color: '#6B7280' }}>
                      {req.employee_email}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6" style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#6B7280' }}>Department</p>
                      <p style={{ color: '#111827' }}>{req.department}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#6B7280' }}>Job Title</p>
                      <p style={{ color: '#111827' }}>{req.job_title}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#6B7280' }}>Location</p>
                      <p style={{ color: '#111827' }}>{req.location}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/multicloud-hub/requests/${req.id}`}
                      className="flex-1 font-semibold py-2 px-4 rounded-lg transition text-center text-white"
                      style={{ backgroundColor: '#6366F1' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4F46E5')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6366F1')}
                    >
                      View →
                    </Link>
                    <button
                      onClick={() => handleDelete(req.id, req.employee_name)}
                      disabled={deleting === req.id}
                      className="font-semibold py-2 px-4 rounded-lg transition text-white"
                      style={{
                        backgroundColor: deleting === req.id ? '#D1D5DB' : '#EF4444',
                        cursor: deleting === req.id ? 'not-allowed' : 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (deleting !== req.id) e.currentTarget.style.backgroundColor = '#DC2626'
                      }}
                      onMouseLeave={(e) => {
                        if (deleting !== req.id) e.currentTarget.style.backgroundColor = '#EF4444'
                      }}
                    >
                      {deleting === req.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : !loading ? (
          <div className="rounded-lg border p-12 text-center" style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }}>
            <p className="text-lg mb-6" style={{ color: '#6B7280' }}>No onboarding requests yet</p>
            <Link
              href="/multicloud-hub/requests/new"
              className="inline-block font-semibold py-3 px-6 rounded-lg transition text-white"
              style={{
                backgroundColor: '#10B981',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10B981')}
            >
              + Create First Request
            </Link>
          </div>
        ) : null}

        {/* Summary Stats */}
        {!loading && requests.length > 0 && (
          <div className="pt-8" style={{ borderTop: '2px solid #E5E7EB' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#111827' }}>Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="rounded-lg border-2 p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Total Requests</p>
                <p className="text-4xl font-bold" style={{ color: '#111827' }}>{requests.length}</p>
              </div>
              <div className="rounded-lg border-2 p-6" style={{ backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: '#92400E' }}>⏳ Pending</p>
                <p className="text-4xl font-bold" style={{ color: '#92400E' }}>
                  {requests.filter((r) => r.status === 'pending').length}
                </p>
              </div>
              <div className="rounded-lg border-2 p-6" style={{ backgroundColor: '#DCFCE7', borderColor: '#10B981' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: '#166534' }}>✅ Approved</p>
                <p className="text-4xl font-bold" style={{ color: '#166534' }}>
                  {requests.filter((r) => r.status === 'approved').length}
                </p>
              </div>
              <div className="rounded-lg border-2 p-6" style={{ backgroundColor: '#CFFAFE', borderColor: '#06B6D4' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: '#164E63' }}>🎉 Completed</p>
                <p className="text-4xl font-bold" style={{ color: '#164E63' }}>
                  {requests.filter((r) => r.status === 'completed').length}
                </p>
              </div>
              <div className="rounded-lg border-2 p-6" style={{ backgroundColor: '#FEE2E2', borderColor: '#EF4444' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: '#991B1B' }}>❌ Rejected</p>
                <p className="text-4xl font-bold" style={{ color: '#991B1B' }}>
                  {requests.filter((r) => r.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
