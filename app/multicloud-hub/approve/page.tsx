'use client'

import { useEffect, useState, Suspense } from 'react'
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

function ApprovalContent() {
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
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }} className="sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#111827' }}>Onboarding Approval</h1>
          <p style={{ color: '#6B7280' }}>Review and approve or deny the onboarding request</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* No Request ID */}
        {!requestId && (
          <div className="rounded-lg border-l-4 p-6" style={{ backgroundColor: '#FEF2F2', borderColor: '#EF4444', color: '#7F1D1D' }}>
            No request ID provided. Please use the link from the email.
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p style={{ color: '#6B7280' }}>Loading request...</p>
          </div>
        )}

        {/* Error */}
        {error && !result.status && (
          <div className="rounded-lg border-l-4 p-6 mb-8" style={{ backgroundColor: '#FEF2F2', borderColor: '#EF4444', color: '#7F1D1D' }}>
            {error}
          </div>
        )}

        {/* Success Result */}
        {result.status && (
          <div className="flex items-center justify-center py-20">
            <div
              className="rounded-2xl border-2 p-12 text-center max-w-md w-full"
              style={{
                backgroundColor: result.status === 'approved' ? '#DCFCE7' : '#FEE2E2',
                borderColor: result.status === 'approved' ? '#10B981' : '#EF4444',
              }}
            >
              {/* Large Success Icon */}
              <div className="mb-6 flex justify-center">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-6xl"
                  style={{
                    backgroundColor: result.status === 'approved' ? '#ECFDF5' : '#FEF2F2',
                    border: `4px solid ${result.status === 'approved' ? '#10B981' : '#EF4444'}`,
                  }}
                >
                  {result.status === 'approved' ? '✅' : '❌'}
                </div>
              </div>

              {/* Status Title */}
              <h2
                className="text-3xl font-bold mb-3"
                style={{
                  color: result.status === 'approved' ? '#166534' : '#991B1B'
                }}
              >
                {result.status === 'approved' ? 'Request Approved' : 'Request Denied'}
              </h2>

              {/* Message */}
              <p
                className="text-base mb-8 leading-relaxed"
                style={{
                  color: result.status === 'approved' ? '#166534' : '#991B1B'
                }}
              >
                {result.message}
              </p>

              {/* What Happens Next */}
              <div
                className="rounded-lg p-4 mb-8 text-sm text-left"
                style={{
                  backgroundColor: result.status === 'approved' ? '#F0FDF4' : '#FEF2F2',
                  borderLeft: `4px solid ${result.status === 'approved' ? '#10B981' : '#EF4444'}`,
                }}
              >
                <p className="font-semibold mb-2" style={{ color: result.status === 'approved' ? '#166534' : '#991B1B' }}>
                  {result.status === 'approved' ? '📧 What Happens Next:' : '📧 Notification Sent:'}
                </p>
                <ul className="space-y-1" style={{ color: result.status === 'approved' ? '#166534' : '#991B1B' }}>
                  {result.status === 'approved' ? (
                    <>
                      <li>• Employee will receive approval notification</li>
                      <li>• Provisioning will begin automatically</li>
                      <li>• Account setup takes 2-4 hours</li>
                    </>
                  ) : (
                    <>
                      <li>• Employee has been notified of denial</li>
                      <li>• Request marked as rejected</li>
                      <li>• New request can be submitted if needed</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Back Button */}
              <Link
                href="/multicloud-hub"
                className="inline-block font-semibold py-3 px-8 rounded-lg transition text-white w-full text-center"
                style={{
                  backgroundColor: result.status === 'approved' ? '#10B981' : '#EF4444',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = result.status === 'approved' ? '#059669' : '#DC2626'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = result.status === 'approved' ? '#10B981' : '#EF4444'
                }}
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Request Details */}
        {!loading && request && !result.status && (
          <div className="space-y-8">
            {/* Employee Info */}
            <div className="rounded-lg border p-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
              <h2 className="text-2xl font-bold mb-8 pb-6 flex items-center gap-2" style={{ color: '#111827', borderBottom: '1px solid #E5E7EB' }}>
                👤 Employee Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Name</p>
                  <p className="text-lg font-semibold" style={{ color: '#111827' }}>{request.employee_name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Email</p>
                  <p className="font-semibold" style={{ color: '#111827' }}>{request.employee_email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Position</p>
                  <p className="font-semibold" style={{ color: '#111827' }}>{request.job_title}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Department</p>
                  <p className="font-semibold" style={{ color: '#111827' }}>{request.department}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Location</p>
                  <p className="font-semibold" style={{ color: '#111827' }}>{request.location}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Start Date</p>
                  <p className="font-semibold" style={{ color: '#111827' }}>
                    {request.start_date ? new Date(request.start_date).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Suggested Provisioning */}
            <div className="rounded-lg border p-8" style={{ backgroundColor: '#F0F9FF', borderColor: '#BFDBFE' }}>
              <h2 className="text-2xl font-bold mb-8 pb-6 flex items-center gap-2" style={{ color: '#111827', borderBottom: '1px solid #E5E7EB' }}>
                🎯 Suggested Provisioning
              </h2>
              <div className="space-y-8">
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>M365 License</p>
                  <p className="text-lg font-semibold" style={{ color: '#1F2937' }}>{request.suggested_m365_license}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: '#6B7280' }}>Entra Groups</p>
                  <div className="flex flex-wrap gap-2">
                    {request.suggested_entra_groups.map((group, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-2 rounded-full text-sm font-medium"
                        style={{ backgroundColor: '#DCFCE7', color: '#166534' }}
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: '#6B7280' }}>Applications</p>
                  <div className="flex flex-wrap gap-2">
                    {request.suggested_apps.map((app, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-2 rounded text-sm font-medium"
                        style={{ backgroundColor: '#DDD6FE', color: '#4F46E5' }}
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Approval Actions */}
            <div className="rounded-lg border p-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
              <h2 className="text-2xl font-bold mb-8 pb-6 flex items-center gap-2" style={{ color: '#111827', borderBottom: '1px solid #E5E7EB' }}>
                📋 Your Decision
              </h2>

              {!showRejectForm ? (
                <div className="flex gap-4">
                  <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="flex-1 font-bold py-4 px-6 rounded-lg transition text-lg text-white"
                    style={{
                      backgroundColor: processing ? '#D1D5DB' : '#10B981',
                      cursor: processing ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!processing) e.currentTarget.style.backgroundColor = '#059669'
                    }}
                    onMouseLeave={(e) => {
                      if (!processing) e.currentTarget.style.backgroundColor = '#10B981'
                    }}
                  >
                    {processing ? 'Processing...' : '✅ Approve Request'}
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={processing}
                    className="flex-1 font-bold py-4 px-6 rounded-lg transition text-lg text-white"
                    style={{
                      backgroundColor: processing ? '#D1D5DB' : '#EF4444',
                      cursor: processing ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!processing) e.currentTarget.style.backgroundColor = '#DC2626'
                    }}
                    onMouseLeave={(e) => {
                      if (!processing) e.currentTarget.style.backgroundColor = '#EF4444'
                    }}
                  >
                    ❌ Deny Request
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold mb-3" style={{ color: '#111827' }}>Reason for Denial (Optional)</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain why you're denying this request..."
                      className="w-full px-4 py-3 rounded-lg border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition"
                      style={{
                        backgroundColor: '#F9FAFB',
                        borderColor: '#E5E7EB',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#EF4444')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleReject}
                      disabled={processing}
                      className="flex-1 font-bold py-3 px-6 rounded-lg transition text-white"
                      style={{
                        backgroundColor: processing ? '#D1D5DB' : '#EF4444',
                        cursor: processing ? 'not-allowed' : 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (!processing) e.currentTarget.style.backgroundColor = '#DC2626'
                      }}
                      onMouseLeave={(e) => {
                        if (!processing) e.currentTarget.style.backgroundColor = '#EF4444'
                      }}
                    >
                      {processing ? 'Processing...' : 'Confirm Denial'}
                    </button>
                    <button
                      onClick={() => setShowRejectForm(false)}
                      disabled={processing}
                      className="flex-1 font-bold py-3 px-6 rounded-lg transition"
                      style={{
                        backgroundColor: '#E5E7EB',
                        color: '#1F2937',
                        cursor: processing ? 'not-allowed' : 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (!processing) e.currentTarget.style.backgroundColor = '#D1D5DB'
                      }}
                      onMouseLeave={(e) => {
                        if (!processing) e.currentTarget.style.backgroundColor = '#E5E7EB'
                      }}
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

export default function ApprovalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
          <p style={{ color: '#6B7280' }}>Loading approval page...</p>
        </div>
      }
    >
      <ApprovalContent />
    </Suspense>
  )
}
