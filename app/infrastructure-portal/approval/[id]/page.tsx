'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Request {
  id: string
  user_email: string
  vm_size: string
  region: string
  compliance_level: string
  cost_estimate: number
  status: string
}

const COST_DETAILS: Record<string, Record<string, number>> = {
  B1s: { free: 0, paid: 7.59 },
  B2s: { free: 30.38, paid: 30.38 },
  B4ms: { free: 60.76, paid: 60.76 },
}

const COMPLIANCE_DETAILS: Record<string, { name: string; services: string[] }> = {
  standard: {
    name: 'Standard',
    services: ['Virtual Machine (compute only)'],
  },
  regulated: {
    name: 'Regulated',
    services: ['Virtual Machine', 'Storage Account (data persistence)', 'Network Security Group'],
  },
  healthcare: {
    name: 'Healthcare (HIPAA-aligned)',
    services: [
      'Virtual Machine',
      'Storage Account (encrypted)',
      'Azure SQL Database',
      'Key Vault (secrets management)',
      'Backup & Recovery',
    ],
  },
}

export default function ApprovalPage() {
  const params = useParams()
  const router = useRouter()
  const [request, setRequest] = useState<Request | null>(null)
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [deployed, setDeployed] = useState(false)
  const [error, setError] = useState('')

  const requestId = params.id as string

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await fetch(`/api/infrastructure/request/${requestId}`)
        if (!response.ok) throw new Error('Failed to fetch request')
        const data = await response.json()
        setRequest(data)
      } catch (err) {
        setError('Failed to load request details')
      } finally {
        setLoading(false)
      }
    }

    fetchRequest()
  }, [requestId])

  const handleApprove = async () => {
    setDeploying(true)
    setError('')

    try {
      const response = await fetch('/api/infrastructure/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Deployment failed')
      }

      setDeployed(true)
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push(`/infrastructure-portal/dashboard`)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during deployment')
    } finally {
      setDeploying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white text-xl">Loading request details...</p>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-red-400 text-xl">Request not found</p>
      </div>
    )
  }

  if (deployed) {
    return (
      <div className="min-h-screen bg-slate-950">
        <header className="bg-slate-900 border-b border-cyan-500 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-white">Infrastructure Deployment</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-8">
            <div className="text-7xl animate-bounce">✅</div>
            <div>
              <h2 className="text-4xl font-bold text-green-400 mb-4">Deployment Successful!</h2>
              <p className="text-white text-xl mb-2">Your infrastructure has been provisioned</p>
              <p className="text-gray-400 text-lg">Redirecting to dashboard...</p>
            </div>

            <div className="bg-slate-900 border border-green-500 rounded-lg p-6">
              <h3 className="text-white font-bold mb-3">✨ What's Next:</h3>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>✅ Resource deployed to your Azure subscription</li>
                <li>✅ Email confirmation sent to {request.user_email}</li>
                <li>✅ Access resource in Infrastructure Dashboard</li>
                <li>✅ Monitor costs and usage</li>
                <li>✅ Delete anytime to stop charges</li>
              </ul>
            </div>

            <Link
              href="/infrastructure-portal/dashboard"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition duration-200 text-lg"
            >
              → Go to Dashboard Now
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const complianceInfo = COMPLIANCE_DETAILS[request.compliance_level]
  const isFreeVM = request.vm_size === 'B1s' && request.compliance_level === 'standard'

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-cyan-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/infrastructure-portal"
            className="text-blue-400 hover:text-blue-300 font-semibold transition duration-200 flex items-center gap-2"
          >
            ← Back to Request Form
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Approval Required</h1>
          <p className="text-gray-300 text-lg">Review your infrastructure request and confirm deployment</p>
        </div>

        <div className="space-y-8">
          {/* Configuration Summary */}
          <div className="bg-slate-900 rounded-lg border border-cyan-500 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Configuration Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Virtual Machine</p>
                <p className="text-white text-lg font-semibold">{request.vm_size}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {request.vm_size === 'B1s' && '1 vCPU, 1GB RAM'}
                  {request.vm_size === 'B2s' && '2 vCPU, 4GB RAM'}
                  {request.vm_size === 'B4ms' && '4 vCPU, 16GB RAM'}
                </p>
              </div>

              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Region</p>
                <p className="text-white text-lg font-semibold capitalize">{request.region}</p>
              </div>

              <div className="bg-slate-800 p-4 rounded-lg md:col-span-2">
                <p className="text-gray-400 text-sm mb-1">Compliance Level</p>
                <p className="text-white text-lg font-semibold">{complianceInfo.name}</p>
              </div>
            </div>

            {/* Services Included */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm mb-3">Services Included</p>
              <ul className="space-y-2">
                {complianceInfo.services.map((service, idx) => (
                  <li key={idx} className="text-white flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-slate-900 rounded-lg border border-green-500 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Cost Breakdown</h2>

            <div className="bg-slate-800 p-6 rounded-lg mb-6">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-white">
                  <span>Monthly Infrastructure Cost:</span>
                  <span className="font-semibold">${request.cost_estimate.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-600 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total Monthly Cost:</span>
                  <span className="text-2xl font-bold text-green-400">
                    {isFreeVM ? '✅ $0 (Free Tier)' : `$${request.cost_estimate.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {isFreeVM && (
                <div className="mt-4 p-3 bg-green-900/30 border border-green-500 rounded text-green-300 text-sm">
                  ✓ Your selection qualifies for Azure free tier for 12 months. After that: $7.59/month
                </div>
              )}
            </div>

            <div className="text-gray-400 text-sm space-y-2">
              <p>• Costs begin upon deployment approval</p>
              <p>• You can delete resources anytime to stop charges</p>
              <p>• Resources auto-expire after 30 days (reminder sent at day 25)</p>
              <p>• Budget alerts: notification if monthly spending exceeds $50</p>
            </div>
          </div>

          {/* Email Confirmation */}
          <div className="bg-slate-900 rounded-lg border border-cyan-500 p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Deployment Details</h2>
            <p className="text-gray-300 mb-4">
              Confirmation email and deployment details will be sent to:
            </p>
            <p className="bg-slate-800 text-cyan-400 px-4 py-3 rounded-lg font-mono">{request.user_email}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-6 py-4 rounded-lg">
              <p className="font-semibold mb-1">Deployment Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleApprove}
              disabled={deploying}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition duration-200 text-lg"
            >
              {deploying ? 'Deploying...' : '✓ Approve & Deploy'}
            </button>

            <Link
              href="/infrastructure-portal"
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-lg transition duration-200 text-center text-lg"
            >
              ← Cancel
            </Link>
          </div>

          {/* Legal Disclaimer */}
          <div className="bg-yellow-900/20 border border-yellow-600 text-yellow-200 px-4 py-3 rounded-lg text-sm">
            <p className="font-semibold mb-1">⚠ Before You Deploy</p>
            <p>
              By approving this deployment, you authorize the creation of Azure infrastructure resources associated
              with the costs shown above. Ensure you have verified the configuration and understand the monthly costs.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
