'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface OnboardingRequest {
  id: string
  employee_name: string
  employee_email: string
  department: string
  job_title: string
  location: string
  worker_type: string
  start_date: string
  manager_name: string
  manager_email: string
  suggested_ad_ou: string
  suggested_entra_groups: string[]
  suggested_m365_license: string
  suggested_apps: string[]
  status: 'pending' | 'approved' | 'rejected' | 'provisioning' | 'completed'
  created_at: string
  approved_at?: string
}

export default function RequestDetail() {
  const router = useRouter()
  const params = useParams()
  const requestId = params.id as string

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [request, setRequest] = useState<OnboardingRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const logged_in = localStorage.getItem('logged_in')
    const user = localStorage.getItem('username')

    if (!logged_in || !user) {
      router.push('/')
      return
    }

    setIsAuthenticated(true)
  }, [router])

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchRequest = async () => {
      try {
        const response = await fetch(`/api/multicloud-hub/requests/${requestId}`)
        if (!response.ok) {
          throw new Error('Request not found')
        }
        const data = await response.json()
        setRequest(data.request)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading request')
      } finally {
        setLoading(false)
      }
    }

    fetchRequest()
  }, [requestId, isAuthenticated])

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
        return 'bg-green-900/30 border-green-600 text-green-300'
      case 'provisioning':
        return 'bg-purple-900/30 border-purple-600 text-purple-300'
      case 'completed':
        return 'bg-cyan-900/30 border-cyan-600 text-cyan-300'
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
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/multicloud-hub/requests"
            className="text-blue-300 hover:text-blue-200 font-semibold transition flex items-center gap-2 mb-4"
          >
            ← Back to All Requests
          </Link>
          <h1 className="text-3xl font-bold text-white">Onboarding Request Details</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading request...</p>
          </div>
        )}

        {!loading && request ? (
          <div className="space-y-8">
            {/* Status Banner */}
            <div className={`rounded-lg border-2 p-6 ${getStatusColor(request.status)}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{getStatusIcon(request.status)}</span>
                <div>
                  <p className="text-sm opacity-75">Current Status</p>
                  <p className="text-2xl font-bold">{request.status.toUpperCase()}</p>
                </div>
              </div>
              <p className="text-sm opacity-75 mt-4">
                Submitted {new Date(request.created_at).toLocaleDateString()} at{' '}
                {new Date(request.created_at).toLocaleTimeString()}
              </p>
            </div>

            {/* Employee Information */}
            <div className="bg-slate-900 rounded-lg border border-blue-500 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                👤 Employee Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Full Name</p>
                  <p className="text-white font-semibold">{request.employee_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-white font-semibold">{request.employee_email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Department</p>
                  <p className="text-white font-semibold">{request.department}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Job Title</p>
                  <p className="text-white font-semibold">{request.job_title}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Location</p>
                  <p className="text-white font-semibold">{request.location}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Worker Type</p>
                  <p className="text-white font-semibold">{request.worker_type}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Start Date</p>
                  <p className="text-white font-semibold">
                    {request.start_date ? new Date(request.start_date).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Manager Information */}
            <div className="bg-slate-900 rounded-lg border border-purple-500 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                👔 Manager Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Manager Name</p>
                  <p className="text-white font-semibold">{request.manager_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Manager Email</p>
                  <p className="text-white font-semibold">{request.manager_email}</p>
                </div>
              </div>
            </div>

            {/* Suggested Provisioning */}
            <div className="bg-cyan-900/20 border border-cyan-500 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                🎯 Suggested Provisioning
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Active Directory OU</p>
                  <p className="text-white font-mono bg-slate-800 px-4 py-2 rounded">
                    {request.suggested_ad_ou}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-3">Entra Groups</p>
                  <div className="flex flex-wrap gap-2">
                    {request.suggested_entra_groups.map((group, idx) => (
                      <span
                        key={idx}
                        className="bg-green-600/30 border border-green-500 text-green-200 px-3 py-1 rounded-full text-sm"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">M365 License</p>
                  <p className="text-white font-semibold text-lg">{request.suggested_m365_license}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-3">Suggested Applications</p>
                  <div className="flex flex-wrap gap-2">
                    {request.suggested_apps.map((app, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-600/30 border border-blue-500 text-blue-200 px-3 py-1 rounded text-sm"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Link
                href="/multicloud-hub/requests"
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition text-center"
              >
                ← Back to Requests
              </Link>
              {request.status === 'pending' && (
                <>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition">
                    ✅ Approve
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition">
                    ❌ Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ) : !loading ? (
          <div className="bg-slate-900 rounded-lg border border-gray-600 p-12 text-center">
            <p className="text-gray-400 text-lg">Request not found</p>
          </div>
        ) : null}
      </main>
    </div>
  )
}
