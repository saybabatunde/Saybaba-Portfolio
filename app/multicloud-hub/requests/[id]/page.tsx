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

interface ProvisioningStep {
  name: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  message: string
}

export default function RequestDetail() {
  const router = useRouter()
  const params = useParams()
  const requestId = params.id as string

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [request, setRequest] = useState<OnboardingRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [approvalResult, setApprovalResult] = useState<{ status: 'approved' | 'rejected' | null; message: string }>({
    status: null,
    message: '',
  })
  const [provisioning, setProvisioning] = useState(false)
  const [provisioningSteps, setProvisioningSteps] = useState<ProvisioningStep[]>([])
  const [deleting, setDeleting] = useState(false)
  const [deletionSteps, setDeletionSteps] = useState<ProvisioningStep[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState('')

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

      setApprovalResult({
        status: 'approved',
        message: `✅ Request approved successfully! ${request.employee_name} will be notified.`,
      })
      setRequest({ ...request, status: 'approved' })
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

      setApprovalResult({
        status: 'rejected',
        message: `❌ Request rejected. ${request.employee_name} will be notified.`,
      })
      setRequest({ ...request, status: 'rejected' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error rejecting request')
    } finally {
      setProcessing(false)
    }
  }

  const handleProvision = async () => {
    if (!request) return

    setProvisioning(true)
    setProvisioningSteps([])

    try {
      const response = await fetch('/api/multicloud-hub/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: request.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to provision account')
      }

      const data = await response.json()
      setProvisioningSteps(data.steps)
      setRequest({ ...request, status: 'completed' })
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error provisioning account')
    } finally {
      setProvisioning(false)
    }
  }

  const handleDelete = async () => {
    if (!request || !deleteEmail) return

    if (!confirm(`Delete ${request.employee_name}'s account from Azure, AWS, and the system? A confirmation will be sent to ${deleteEmail}`)) {
      return
    }

    setDeleting(true)
    setDeletionSteps([])
    setShowDeleteModal(false)

    try {
      const response = await fetch('/api/multicloud-hub/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: request.id, notificationEmail: deleteEmail }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete request')
      }

      const data = await response.json()
      setDeletionSteps(data.steps)
      // Redirect after a brief delay
      setTimeout(() => {
        router.push('/multicloud-hub/requests')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting request')
    } finally {
      setDeleting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
        <p style={{ color: '#6B7280' }}>Loading...</p>
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
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }} className="sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link
            href="/multicloud-hub/requests"
            className="inline-flex items-center gap-2 mb-6 font-medium transition"
            style={{ color: '#6366F1' }}
          >
            ← Back to All Requests
          </Link>
          <h1 className="text-4xl font-bold" style={{ color: '#111827' }}>Onboarding Request Details</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {error && (
          <div className="rounded-lg border-l-4 p-6 mb-8" style={{ backgroundColor: '#FEF2F2', borderColor: '#EF4444', color: '#7F1D1D' }}>
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <p style={{ color: '#6B7280' }}>Loading request...</p>
          </div>
        )}

        {!loading && request ? (
          <div className="space-y-8">
            {/* Status Banner */}
            <div className="rounded-lg border-2 p-8" style={{
              backgroundColor: request.status === 'pending' ? '#FEF3C7' :
                request.status === 'approved' ? '#DCFCE7' :
                request.status === 'provisioning' ? '#E9D5FF' :
                request.status === 'completed' ? '#CFFAFE' :
                request.status === 'rejected' ? '#FEE2E2' : '#F3F4F6',
              borderColor: request.status === 'pending' ? '#F59E0B' :
                request.status === 'approved' ? '#10B981' :
                request.status === 'provisioning' ? '#A855F7' :
                request.status === 'completed' ? '#06B6D4' :
                request.status === 'rejected' ? '#EF4444' : '#9CA3AF',
            }}>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{getStatusIcon(request.status)}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#6B7280' }}>Current Status</p>
                  <p className="text-3xl font-bold" style={{
                    color: request.status === 'pending' ? '#92400E' :
                      request.status === 'approved' ? '#166534' :
                      request.status === 'provisioning' ? '#6D28D9' :
                      request.status === 'completed' ? '#164E63' :
                      request.status === 'rejected' ? '#991B1B' : '#1F2937'
                  }}>
                    {request.status.toUpperCase()}
                  </p>
                </div>
              </div>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                Submitted {new Date(request.created_at).toLocaleDateString()} at{' '}
                {new Date(request.created_at).toLocaleTimeString()}
              </p>
            </div>

            {/* Employee Information */}
            <div className="rounded-lg border p-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
              <h2 className="text-2xl font-bold mb-8 pb-6 flex items-center gap-2" style={{ color: '#111827', borderBottom: '1px solid #E5E7EB' }}>
                👤 Employee Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Full Name</p>
                  <p className="text-lg font-semibold" style={{ color: '#111827' }}>{request.employee_name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Email</p>
                  <p className="text-lg font-semibold" style={{ color: '#111827' }}>{request.employee_email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Department</p>
                  <p className="text-lg font-semibold" style={{ color: '#111827' }}>{request.department}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Job Title</p>
                  <p className="text-lg font-semibold" style={{ color: '#111827' }}>{request.job_title}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Location</p>
                  <p className="text-lg font-semibold" style={{ color: '#111827' }}>{request.location}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Worker Type</p>
                  <p className="text-lg font-semibold" style={{ color: '#111827' }}>{request.worker_type}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Start Date</p>
                  <p className="text-lg font-semibold" style={{ color: '#111827' }}>
                    {request.start_date ? new Date(request.start_date).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Manager Information */}
            <div className="rounded-lg border p-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
              <h2 className="text-2xl font-bold mb-8 pb-6 flex items-center gap-2" style={{ color: '#111827', borderBottom: '1px solid #E5E7EB' }}>
                👔 Manager Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Manager Name</p>
                  <p className="text-lg font-semibold" style={{ color: '#111827' }}>{request.manager_name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Manager Email</p>
                  <p className="text-lg font-semibold" style={{ color: '#111827' }}>{request.manager_email}</p>
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
                  <p className="text-sm font-semibold mb-3" style={{ color: '#6B7280' }}>Active Directory OU</p>
                  <p className="text-sm font-mono p-3 rounded-lg" style={{ backgroundColor: '#E0E7FF', color: '#4F46E5' }}>
                    {request.suggested_ad_ou}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: '#6B7280' }}>Entra Groups</p>
                  <div className="flex flex-wrap gap-2">
                    {request.suggested_entra_groups.map((group, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: '#DDD6FE', color: '#4F46E5' }}
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>M365 License</p>
                  <p className="text-lg font-semibold" style={{ color: '#1F2937' }}>{request.suggested_m365_license}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: '#6B7280' }}>Suggested Applications</p>
                  <div className="flex flex-wrap gap-2">
                    {request.suggested_apps.map((app, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: '#DCFCE7', color: '#166534' }}
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Approval Result */}
            {approvalResult.status && (
              <div
                className="rounded-lg border-2 p-8 text-center mb-8"
                style={{
                  backgroundColor: approvalResult.status === 'approved' ? '#DCFCE7' : '#FEE2E2',
                  borderColor: approvalResult.status === 'approved' ? '#10B981' : '#EF4444',
                }}
              >
                <p
                  className="text-lg font-semibold"
                  style={{
                    color: approvalResult.status === 'approved' ? '#166534' : '#991B1B'
                  }}
                >
                  {approvalResult.message}
                </p>
              </div>
            )}

            {/* Provisioning Steps */}
            {(provisioningSteps.length > 0 || provisioning) && (
              <div className="rounded-lg border p-8" style={{ backgroundColor: '#F3E8FF', borderColor: '#E9D5FF' }}>
                <h2 className="text-2xl font-bold mb-8 pb-6 flex items-center gap-2" style={{ color: '#111827', borderBottom: '1px solid #E5E7EB' }}>
                  🚀 Provisioning Status
                </h2>
                <div className="space-y-4">
                  {provisioningSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                      <div className="flex-shrink-0 pt-1">
                        {step.status === 'completed' && <span className="text-2xl">✅</span>}
                        {step.status === 'in-progress' && <span className="text-2xl">⏳</span>}
                        {step.status === 'failed' && <span className="text-2xl">❌</span>}
                        {step.status === 'pending' && <span className="text-2xl">⭕</span>}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold" style={{ color: '#111827' }}>{step.name}</p>
                        <p className="text-sm" style={{ color: '#6B7280' }}>{step.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deletion Steps */}
            {(deletionSteps.length > 0 || deleting) && (
              <div className="rounded-lg border p-8" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA' }}>
                <h2 className="text-2xl font-bold mb-8 pb-6 flex items-center gap-2" style={{ color: '#111827', borderBottom: '1px solid #E5E7EB' }}>
                  🗑️ Deletion Status
                </h2>
                <div className="space-y-4">
                  {deletionSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                      <div className="flex-shrink-0 pt-1">
                        {step.status === 'completed' && <span className="text-2xl">✅</span>}
                        {step.status === 'in-progress' && <span className="text-2xl">⏳</span>}
                        {step.status === 'failed' && <span className="text-2xl">❌</span>}
                        {step.status === 'pending' && <span className="text-2xl">⭕</span>}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold" style={{ color: '#111827' }}>{step.name}</p>
                        <p className="text-sm" style={{ color: '#6B7280' }}>{step.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rejection Form */}
            {showRejectForm && request.status === 'pending' && (
              <div className="rounded-lg border p-8" style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: '#991B1B' }}>Reason for Rejection</h3>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why you're rejecting this request..."
                  className="w-full px-4 py-3 rounded-lg border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition mb-4"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5E7EB',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#EF4444')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
                  rows={4}
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleReject}
                    disabled={processing}
                    className="flex-1 font-semibold py-3 px-6 rounded-lg transition text-white"
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
                    {processing ? 'Processing...' : 'Confirm Rejection'}
                  </button>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    disabled={processing}
                    className="flex-1 font-semibold py-3 px-6 rounded-lg transition"
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

            {/* Delete Email Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="rounded-lg border-2 p-8 max-w-md w-full mx-4" style={{ backgroundColor: '#FFFFFF', borderColor: '#EF4444' }}>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#991B1B' }}>Delete & Clean Up</h3>
                  <p className="mb-6" style={{ color: '#6B7280' }}>
                    Enter the email address where the deletion confirmation should be sent.
                  </p>
                  <input
                    type="email"
                    value={deleteEmail}
                    onChange={(e) => setDeleteEmail(e.target.value)}
                    placeholder="Email address for confirmation"
                    className="w-full px-4 py-3 rounded-lg border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition mb-6"
                    style={{
                      backgroundColor: '#F9FAFB',
                      borderColor: '#E5E7EB',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#EF4444')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleDelete}
                      disabled={!deleteEmail || deleting}
                      className="flex-1 font-semibold py-3 px-4 rounded-lg transition text-white"
                      style={{
                        backgroundColor: !deleteEmail || deleting ? '#D1D5DB' : '#EF4444',
                        cursor: !deleteEmail || deleting ? 'not-allowed' : 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (!(!deleteEmail || deleting)) e.currentTarget.style.backgroundColor = '#DC2626'
                      }}
                      onMouseLeave={(e) => {
                        if (!(!deleteEmail || deleting)) e.currentTarget.style.backgroundColor = '#EF4444'
                      }}
                    >
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      disabled={deleting}
                      className="flex-1 font-semibold py-3 px-4 rounded-lg transition"
                      style={{
                        backgroundColor: '#E5E7EB',
                        color: '#1F2937',
                        cursor: deleting ? 'not-allowed' : 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (!deleting) e.currentTarget.style.backgroundColor = '#D1D5DB'
                      }}
                      onMouseLeave={(e) => {
                        if (!deleting) e.currentTarget.style.backgroundColor = '#E5E7EB'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-6">
              <Link
                href="/multicloud-hub/requests"
                className="flex-1 min-w-[150px] font-semibold py-3 px-6 rounded-lg transition text-center"
                style={{
                  backgroundColor: '#E5E7EB',
                  color: '#1F2937',
                }}
              >
                ← Back to Requests
              </Link>
              {request.status === 'pending' && !approvalResult.status && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="flex-1 min-w-[150px] font-semibold py-3 px-6 rounded-lg transition text-white"
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
                    {processing ? 'Processing...' : '✅ Approve'}
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={processing}
                    className="flex-1 min-w-[150px] font-semibold py-3 px-6 rounded-lg transition text-white"
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
                    ❌ Reject
                  </button>
                </>
              )}
              {request.status === 'approved' && (
                <button
                  onClick={handleProvision}
                  disabled={provisioning}
                  className="flex-1 min-w-[150px] font-semibold py-3 px-6 rounded-lg transition text-white"
                  style={{
                    backgroundColor: provisioning ? '#D1D5DB' : '#6366F1',
                    cursor: provisioning ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!provisioning) e.currentTarget.style.backgroundColor = '#4F46E5'
                  }}
                  onMouseLeave={(e) => {
                    if (!provisioning) e.currentTarget.style.backgroundColor = '#6366F1'
                  }}
                >
                  {provisioning ? 'Provisioning...' : '🚀 Provision Now'}
                </button>
              )}
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={deleting}
                className="flex-1 min-w-[150px] font-semibold py-3 px-6 rounded-lg transition text-white"
                style={{
                  backgroundColor: deleting ? '#D1D5DB' : '#DC2626',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!deleting) e.currentTarget.style.backgroundColor = '#B91C1C'
                }}
                onMouseLeave={(e) => {
                  if (!deleting) e.currentTarget.style.backgroundColor = '#DC2626'
                }}
              >
                {deleting ? 'Deleting...' : '🗑️ Delete & Clean Up'}
              </button>
            </div>
          </div>
        ) : !loading ? (
          <div className="rounded-lg border p-12 text-center" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
            <p className="text-lg" style={{ color: '#6B7280' }}>Request not found</p>
          </div>
        ) : null}
      </main>
    </div>
  )
}
