'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const VM_SIZES = [
  { id: 'B1s', name: 'B1s (1 vCPU, 1GB RAM)', monthlyCost: 7.59, free: true },
  { id: 'B2s', name: 'B2s (2 vCPU, 4GB RAM)', monthlyCost: 30.38, free: false },
  { id: 'B4ms', name: 'B4ms (4 vCPU, 16GB RAM)', monthlyCost: 60.76, free: false },
]

const REGIONS = [
  { id: 'eastus', name: 'East US' },
  { id: 'uksouth', name: 'UK South' },
  { id: 'westeurope', name: 'West Europe' },
]

const COMPLIANCE_LEVELS = [
  { id: 'standard', name: 'Standard', description: 'VM only, no database' },
  { id: 'regulated', name: 'Regulated', description: 'VM + Storage Account' },
  { id: 'healthcare', name: 'Healthcare', description: 'VM + Storage + SQL Database + Key Vault' },
]

const COMPLIANCE_COST = {
  standard: 0,
  regulated: 10.58,
  healthcare: 50,
}

export default function InfrastructurePortal() {
  const router = useRouter()
  const [vmSize, setVmSize] = useState('B1s')
  const [region, setRegion] = useState('eastus')
  const [complianceLevel, setComplianceLevel] = useState('standard')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedVM = VM_SIZES.find((v) => v.id === vmSize)
  const vmCost = selectedVM?.monthlyCost || 0
  const complianceCost = COMPLIANCE_COST[complianceLevel as keyof typeof COMPLIANCE_COST]
  const totalMonthlyCost = vmCost + complianceCost
  const isFree12Months = selectedVM?.free && complianceLevel === 'standard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/infrastructure/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vmSize,
          region,
          complianceLevel,
          email,
          costEstimate: totalMonthlyCost,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit request')
      }

      const data = await response.json()
      router.push(`/infrastructure-portal/approval/${data.requestId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-cyan-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/dashboard"
            className="text-blue-400 hover:text-blue-300 font-semibold transition duration-200 flex items-center gap-2"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Infrastructure Request Portal</h1>
          <p className="text-gray-300 text-lg">
            Request Azure infrastructure. Select your requirements below, review the cost, and submit for approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900 rounded-lg border border-cyan-500 p-8">
          {/* VM Size Selection */}
          <div>
            <label className="block text-white font-semibold mb-4">Virtual Machine Size</label>
            <div className="space-y-3">
              {VM_SIZES.map((vm) => (
                <label key={vm.id} className="flex items-center p-4 border border-gray-600 rounded-lg cursor-pointer hover:bg-slate-800 transition">
                  <input
                    type="radio"
                    name="vmSize"
                    value={vm.id}
                    checked={vmSize === vm.id}
                    onChange={(e) => setVmSize(e.target.value)}
                    className="w-4 h-4 mr-4"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">{vm.name}</p>
                    <p className="text-gray-400 text-sm">
                      {vm.free ? '✅ Free for 12 months, then ' : ''}${vm.monthlyCost}/month
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Region Selection */}
          <div>
            <label className="block text-white font-semibold mb-4">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Compliance Level */}
          <div>
            <label className="block text-white font-semibold mb-4">Compliance & Workload Level</label>
            <div className="space-y-3">
              {COMPLIANCE_LEVELS.map((level) => (
                <label key={level.id} className="flex items-start p-4 border border-gray-600 rounded-lg cursor-pointer hover:bg-slate-800 transition">
                  <input
                    type="radio"
                    name="complianceLevel"
                    value={level.id}
                    checked={complianceLevel === level.id}
                    onChange={(e) => setComplianceLevel(e.target.value)}
                    className="w-4 h-4 mr-4 mt-1"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">{level.name}</p>
                    <p className="text-gray-400 text-sm">{level.description}</p>
                    <p className="text-cyan-400 text-sm mt-1">
                      +${COMPLIANCE_COST[level.id as keyof typeof COMPLIANCE_COST]}/month
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-white font-semibold mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
            <p className="text-gray-400 text-sm mt-2">Confirmation and deployment details will be sent here</p>
          </div>

          {/* Cost Summary */}
          <div className="bg-slate-800 border border-cyan-400 rounded-lg p-6">
            <h3 className="text-white font-bold mb-4">Cost Summary</h3>
            <div className="space-y-2 mb-4 text-white">
              <div className="flex justify-between">
                <span>Virtual Machine:</span>
                <span>${vmCost.toFixed(2)}/month</span>
              </div>
              <div className="flex justify-between">
                <span>Compliance + Services:</span>
                <span>${complianceCost.toFixed(2)}/month</span>
              </div>
              <div className="border-t border-gray-600 pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Total Monthly Cost:</span>
                <span className={isFree12Months ? 'text-green-400' : 'text-cyan-400'}>
                  {isFree12Months ? '✅ $0 (Free Tier)' : `$${totalMonthlyCost.toFixed(2)}`}
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              {isFree12Months
                ? 'Your selection qualifies for Azure free tier for 12 months. After that, costs apply.'
                : 'Costs apply immediately. You can delete resources anytime.'}
            </p>
          </div>

          {error && <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg">{error}</div>}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            {loading ? 'Submitting...' : 'Review & Approve →'}
          </button>
        </form>

        <div className="mt-12 bg-blue-900/20 border border-blue-500 rounded-lg p-6 text-blue-100">
          <h3 className="font-bold mb-2">About This Portal</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Select infrastructure requirements (VM size, region, compliance level)</li>
            <li>Review cost estimate before approval</li>
            <li>Infrastructure provisioned automatically via Terraform</li>
            <li>Access deployed resources in your dashboard</li>
            <li>Delete anytime to stop costs (30-day auto-cleanup available)</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
