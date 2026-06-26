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
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <Link
              href="/infrastructure-portal/dashboard"
              className="font-semibold transition duration-200 flex items-center gap-2"
              style={{ color: '#0078D4' }}
            >
              ← View My Resources
            </Link>
          </div>
          <Link
            href="/dashboard"
            className="font-semibold transition duration-200 flex items-center gap-2 text-sm"
            style={{ color: '#6B7280' }}
          >
            Back to Main Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#111827' }}>Create Virtual Machine</h1>
          <p className="text-lg" style={{ color: '#6B7280' }}>
            Configure your Azure infrastructure. Choose VM size, region, and compliance level.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Form - Left Side */}
          <form onSubmit={handleSubmit} className="col-span-2 space-y-8">
            {/* VM Size Section */}
            <div className="rounded-lg" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #0078D4' }} className="p-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>
                Instance Details
              </h2>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
                Choose the virtual machine size that fits your workload requirements.
              </p>

              <label className="block font-bold mb-4" style={{ color: '#111827' }}>
                Virtual Machine Size
              </label>
              <div className="space-y-3">
                {VM_SIZES.map((vm) => (
                  <label
                    key={vm.id}
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                    style={{
                      backgroundColor: vmSize === vm.id ? '#E0F2FE' : '#FFFFFF',
                      borderColor: vmSize === vm.id ? '#0078D4' : '#E5E7EB',
                    }}
                  >
                    <input
                      type="radio"
                      name="vmSize"
                      value={vm.id}
                      checked={vmSize === vm.id}
                      onChange={(e) => setVmSize(e.target.value)}
                      className="w-4 h-4 mr-4"
                    />
                    <div className="flex-1">
                      <p className="font-bold" style={{ color: '#111827' }}>
                        {vm.name}
                      </p>
                      <p className="text-sm" style={{ color: '#6B7280' }}>
                        {vm.free ? '✅ Free for 12 months, then ' : ''}${vm.monthlyCost}/month
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Region Section */}
            <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #0078D4' }}>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>
                Geography
              </h2>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
                Select the Azure region where your resources will be deployed.
              </p>

              <label className="block font-bold mb-4" style={{ color: '#111827' }}>
                Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  color: '#111827',
                }}
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Compliance Section */}
            <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #0078D4' }}>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>
                Compliance & Services
              </h2>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
                Select your compliance level. Additional services will be added based on requirements.
              </p>

              <label className="block font-bold mb-4" style={{ color: '#111827' }}>
                Workload Level
              </label>
              <div className="space-y-3">
                {COMPLIANCE_LEVELS.map((level) => (
                  <label
                    key={level.id}
                    className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition"
                    style={{
                      backgroundColor: complianceLevel === level.id ? '#E0F2FE' : '#FFFFFF',
                      borderColor: complianceLevel === level.id ? '#0078D4' : '#E5E7EB',
                    }}
                  >
                    <input
                      type="radio"
                      name="complianceLevel"
                      value={level.id}
                      checked={complianceLevel === level.id}
                      onChange={(e) => setComplianceLevel(e.target.value)}
                      className="w-4 h-4 mr-4 mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-bold" style={{ color: '#111827' }}>
                        {level.name}
                      </p>
                      <p className="text-sm" style={{ color: '#6B7280' }}>
                        {level.description}
                      </p>
                      <p className="text-sm font-semibold mt-2" style={{ color: '#0078D4' }}>
                        +${COMPLIANCE_COST[level.id as keyof typeof COMPLIANCE_COST]}/month
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notification Section */}
            <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #0078D4' }}>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>
                Notification
              </h2>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
                We'll send deployment confirmation and access details to your email.
              </p>

              <label className="block font-bold mb-2" style={{ color: '#111827' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  color: '#111827',
                }}
              />
              <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
                Confirmation and deployment details will be sent here
              </p>
            </div>

            {error && (
              <div className="rounded-lg border-l-4 border-red-500 p-4" style={{ backgroundColor: '#FEF2F2', color: '#991B1B' }}>
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full font-bold py-3 px-6 rounded-lg transition duration-200 text-white text-lg"
              style={{
                backgroundColor: loading || !email ? '#D1D5DB' : '#0078D4',
              }}
            >
              {loading ? 'Submitting...' : 'Review & Approve →'}
            </button>
          </form>

          {/* Cost Summary - Right Sidebar */}
          <div>
            <div className="rounded-lg p-6 sticky top-20" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #10B981' }}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#111827' }}>
                Estimated Cost
              </h3>

              <div className="space-y-4 mb-6" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '1.5rem' }}>
                <div className="flex justify-between">
                  <span style={{ color: '#6B7280' }}>Virtual Machine (B1s)</span>
                  <span className="font-bold" style={{ color: '#111827' }}>
                    ${vmCost.toFixed(2)}/mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#6B7280' }}>Compliance Services</span>
                  <span className="font-bold" style={{ color: '#111827' }}>
                    ${complianceCost.toFixed(2)}/mo
                  </span>
                </div>
              </div>

              <div className="mb-6 pb-6" style={{ borderBottom: '1px solid #E5E7EB' }}>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold" style={{ color: '#111827' }}>
                    Total Monthly
                  </span>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: isFree12Months ? '#10B981' : '#0078D4' }}
                  >
                    {isFree12Months ? '✅ $0' : `$${totalMonthlyCost.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {isFree12Months && (
                <div className="rounded p-3 mb-6" style={{ backgroundColor: '#DCFCE7', borderLeft: '4px solid #10B981' }}>
                  <p className="text-sm font-semibold" style={{ color: '#166534' }}>
                    ✅ Free for 12 months
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#166534' }}>
                    This selection qualifies for the Azure free tier. After 12 months, standard rates apply.
                  </p>
                </div>
              )}

              <div className="rounded p-4" style={{ backgroundColor: '#F0F9FF' }}>
                <p className="text-xs" style={{ color: '#1E40AF' }}>
                  💡 <span className="font-semibold">Tip:</span> You can delete resources anytime to stop charges.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-12 rounded-lg p-8" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #0078D4' }}>
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#111827' }}>
            ℹ️ How This Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { num: '1️⃣', title: 'Select Configuration', desc: 'Choose VM size, region, and compliance' },
              { num: '2️⃣', title: 'Review Estimate', desc: 'See cost breakdown before approval' },
              { num: '3️⃣', title: 'Auto Provision', desc: 'Terraform deploys your infrastructure' },
              { num: '4️⃣', title: 'Access Resources', desc: 'View deployed resources in dashboard' },
              { num: '5️⃣', title: 'Manage Anytime', desc: 'Delete to stop costs (30-day cleanup)' },
            ].map((step, i) => (
              <div key={i}>
                <p className="text-2xl mb-2">{step.num}</p>
                <p className="font-bold mb-1" style={{ color: '#111827' }}>
                  {step.title}
                </p>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
