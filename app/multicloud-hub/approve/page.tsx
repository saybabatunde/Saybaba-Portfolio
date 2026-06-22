'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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
  status: string
  created_at: string
}

export default function ApprovalPage() {
  const searchParams = useSearchParams()
  const requestId = searchParams.get('requestId')

  const [request, setRequest] = useState<OnboardingRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [result, setResult] = useState<{ status: 'approved' | 'rejected' | null; message: string }>({
    status: null,
    message: '',
  })

  useEffect(() => {
    if (!requestId) {
      setError('No request ID provided')
      setLoading(false)
      return
    }

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
  }, [requestId])

  const handleApprove = async () => {
    if (!request) return

    setProcessing(true)
    try {
      const response = await fetch('/api/multicloud-hub/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.id,
          action: 'approve',
          managerEmail: request.manager_email,
          managerName: request.manager_name,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve request')
      }

      setResult({
        status: 'approved',
        message: `✅ Request approved successfully! ${request.employee_name} will be notified.`,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error approving request')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!request) return

    setProcessing(true)
    try {
      const response = await fetch('/api/multicloud-hub/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.id,
          action: 'reject',
          rejectionReason,
          managerEmail: request.manager_email,
          managerName: request.manager_name,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject request')
      }

      setResult({
        status: 'rejected',
        message: `❌ Request rejected. ${request.employee_name} will be notified.`,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error rejecting request')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-purple-900 border-b border-blue-500 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">Onboarding Approval</h1>
          <p className="text-blue-200 text-sm mt-2">Review and approve or deny the onboarding request</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* No Request ID */}
        {!requestId && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-6 py-4 rounded-lg">
            No request ID provided. Please use the link from the email.
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading request...</p>
          </div>
        )}

        {/* Error */}
        {error && !result.status && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Success Result */}
        {result.status && (
          <div className={`rounded-lg border-2 p-8 text-center mb-8 ${
            result.status === 'approved'
              ? 'bg-green-900/30 border-green-600'
              : 'bg-red-900/30 border-red-600'
          }`}>
            <p className="text-3xl mb-4">{result.status === 'approved' ? '✅' : '❌'}</p>
            <p className={`text-lg font-semibold ${
              result.status === 'approved' ? 'text-green-300' : 'text-red-300'
            }`}>
              {result.message}
            </p>
            <Link
              href="/multicloud-hub"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Back to Dashboard
            </Link>
          </div>
        )}

        {/* Request Details */}
        {!loading && request && !result.status && (
          <div className="space-y-8">
            {/* Employee Info */}
            <div className="bg-slate-900 rounded-lg border border-blue-500 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">👤 Employee Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Name</p>
                  <p className="text-white font-semibold text-lg">{request.employee_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-white font-semibold">{request.employee_email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Position</p>
                  <p className="text-white font-semibold">{request.job_title}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Department</p>
                  <p className="text-white font-semibold">{request.department}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Location</p>
                  <p className="text-white font-semibold">{request.location}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Start Date</p>
                  <p className="text-white font-semibold">
                    {request.start_date ? new Date(request.start_date).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Suggested Provisioning */}
            <div className="bg-cyan-900/20 border border-cyan-500 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">🎯 Suggested Provisioning</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-400 text-sm mb-2">M365 License</p>
                  <p className="text-white font-semibold text-lg">{request.suggested_m365_license}</p>
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
                  <p className="text-gray-400 text-sm mb-3">Applications</p>
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

            {/* Approval Actions */}
            <div className="bg-slate-900 rounded-lg border border-gray-600 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">📋 Your Decision</h2>

              {!showRejectForm ? (
                <div className="flex gap-4">
                  <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
                  >
                    {processing ? 'Processing...' : '✅ Approve Request'}
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={processing}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
                  >
                    ❌ Deny Request
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Reason for Denial (Optional)</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain why you're denying this request..."
                      className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-400"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleReject}
                      disabled={processing}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition"
                    >
                      {processing ? 'Processing...' : 'Confirm Denial'}
                    </button>
                    <button
                      onClick={() => setShowRejectForm(false)}
                      disabled={processing}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
