'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface CloudResource {
  id: string
  resource_name: string
  resource_type: string
  cloud_provider: string
  environment: string
  owner_email: string
  cost_estimate_monthly: number
  risk_level: string
  is_tagged: boolean
  is_public: boolean
  last_scanned: string
}

const SAMPLE_RESOURCES: CloudResource[] = [
  {
    id: '1',
    resource_name: 'prod-api-lambda',
    resource_type: 'Lambda',
    cloud_provider: 'AWS',
    environment: 'prod',
    owner_email: 'devops@company.com',
    cost_estimate_monthly: 45.50,
    risk_level: 'low',
    is_tagged: true,
    is_public: false,
    last_scanned: '2 hours ago',
  },
  {
    id: '2',
    resource_name: 'finance-storage',
    resource_type: 'Storage Account',
    cloud_provider: 'Azure',
    environment: 'prod',
    owner_email: 'finance@company.com',
    cost_estimate_monthly: 120.00,
    risk_level: 'medium',
    is_tagged: false,
    is_public: false,
    last_scanned: '5 hours ago',
  },
  {
    id: '3',
    resource_name: 'saybaba-portfolio',
    resource_type: 'Vercel Project',
    cloud_provider: 'Vercel',
    environment: 'prod',
    owner_email: 'olawalebabatunde98@gmail.com',
    cost_estimate_monthly: 0.00,
    risk_level: 'low',
    is_tagged: true,
    is_public: true,
    last_scanned: '1 hour ago',
  },
  {
    id: '4',
    resource_name: 'engineering-vm-001',
    resource_type: 'Virtual Machine',
    cloud_provider: 'Azure',
    environment: 'dev',
    owner_email: 'engineering@company.com',
    cost_estimate_monthly: 85.25,
    risk_level: 'high',
    is_tagged: false,
    is_public: false,
    last_scanned: '3 hours ago',
  },
  {
    id: '5',
    resource_name: 'logs-bucket-prod',
    resource_type: 'S3',
    cloud_provider: 'AWS',
    environment: 'prod',
    owner_email: 'devops@company.com',
    cost_estimate_monthly: 250.75,
    risk_level: 'medium',
    is_tagged: true,
    is_public: false,
    last_scanned: '1 hour ago',
  },
]

export default function CloudInventory() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [resources, setResources] = useState<CloudResource[]>(SAMPLE_RESOURCES)
  const [filterProvider, setFilterProvider] = useState('')
  const [filterEnvironment, setFilterEnvironment] = useState('')
  const [filterRisk, setFilterRisk] = useState('')

  useEffect(() => {
    const logged_in = localStorage.getItem('logged_in')
    const user = localStorage.getItem('username')

    if (!logged_in || !user) {
      router.push('/')
      return
    }

    setIsAuthenticated(true)
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  const filteredResources = resources.filter((r) => {
    const matchesProvider = !filterProvider || r.cloud_provider === filterProvider
    const matchesEnvironment = !filterEnvironment || r.environment === filterEnvironment
    const matchesRisk = !filterRisk || r.risk_level === filterRisk
    return matchesProvider && matchesEnvironment && matchesRisk
  })

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-900/30 border-green-600 text-green-300'
      case 'medium':
        return 'bg-yellow-900/30 border-yellow-600 text-yellow-300'
      case 'high':
        return 'bg-red-900/30 border-red-600 text-red-300'
      default:
        return 'bg-gray-900/30 border-gray-600 text-gray-300'
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'AWS':
        return 'bg-orange-600/20 text-orange-300 border-orange-600'
      case 'Azure':
        return 'bg-blue-600/20 text-blue-300 border-blue-600'
      case 'Vercel':
        return 'bg-gray-600/20 text-gray-300 border-gray-600'
      default:
        return 'bg-purple-600/20 text-purple-300 border-purple-600'
    }
  }

  const totalMonthlyCost = filteredResources.reduce((sum, r) => sum + r.cost_estimate_monthly, 0)
  const untaggedCount = filteredResources.filter((r) => !r.is_tagged).length
  const publicCount = filteredResources.filter((r) => r.is_public).length
  const highRiskCount = filteredResources.filter((r) => r.risk_level === 'high').length

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-900 to-blue-900 border-b border-cyan-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/multicloud-hub"
            className="text-cyan-300 hover:text-cyan-200 font-semibold transition flex items-center gap-2 mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Cloud Resource Inventory</h1>
          <p className="text-cyan-200 text-sm mt-2">Multi-cloud resource tracking across Azure, AWS, Vercel, and more</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 rounded-lg border border-gray-600 p-6">
            <p className="text-gray-400 text-sm mb-2">Total Resources</p>
            <p className="text-4xl font-bold text-white">{filteredResources.length}</p>
          </div>
          <div className="bg-cyan-900/20 rounded-lg border border-cyan-600 p-6">
            <p className="text-cyan-300 text-sm mb-2">Monthly Cost</p>
            <p className="text-4xl font-bold text-cyan-300">${totalMonthlyCost.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-900/20 rounded-lg border border-yellow-600 p-6">
            <p className="text-yellow-300 text-sm mb-2">Untagged</p>
            <p className="text-4xl font-bold text-yellow-300">{untaggedCount}</p>
          </div>
          <div className="bg-red-900/20 rounded-lg border border-red-600 p-6">
            <p className="text-red-300 text-sm mb-2">High Risk</p>
            <p className="text-4xl font-bold text-red-300">{highRiskCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 rounded-lg border border-gray-600 p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">🔍 Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Cloud Provider</label>
              <select
                value={filterProvider}
                onChange={(e) => setFilterProvider(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Providers</option>
                <option value="AWS">AWS</option>
                <option value="Azure">Azure</option>
                <option value="Vercel">Vercel</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Environment</label>
              <select
                value={filterEnvironment}
                onChange={(e) => setFilterEnvironment(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Environments</option>
                <option value="dev">Development</option>
                <option value="staging">Staging</option>
                <option value="prod">Production</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Risk Level</label>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Risks</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources Table */}
        {filteredResources.length > 0 ? (
          <div className="bg-slate-900 rounded-lg border border-gray-600 overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-7 gap-4 bg-slate-800 border-b border-gray-600 p-4 font-bold text-gray-300 text-sm">
              <div>Resource</div>
              <div>Type</div>
              <div>Provider</div>
              <div>Environment</div>
              <div>Cost/Month</div>
              <div>Risk</div>
              <div>Status</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-600">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="p-4 hover:bg-slate-800/50 transition">
                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-semibold">{resource.resource_name}</p>
                        <p className="text-gray-400 text-xs">{resource.resource_type}</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded border ${getProviderColor(
                          resource.cloud_provider
                        )}`}
                      >
                        {resource.cloud_provider}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">${resource.cost_estimate_monthly}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded border ${getRiskColor(resource.risk_level)}`}>
                        {resource.risk_level.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:grid grid-cols-7 gap-4 items-center">
                    <div>
                      <p className="text-white font-semibold text-sm">{resource.resource_name}</p>
                      <p className="text-gray-400 text-xs">{resource.owner_email}</p>
                    </div>

                    <div className="text-gray-300 text-sm">{resource.resource_type}</div>

                    <div>
                      <span className={`text-xs font-bold px-2 py-1 rounded border ${getProviderColor(resource.cloud_provider)}`}>
                        {resource.cloud_provider}
                      </span>
                    </div>

                    <div className="text-gray-300 text-sm capitalize">{resource.environment}</div>

                    <div className="text-cyan-300 font-semibold">${resource.cost_estimate_monthly.toFixed(2)}</div>

                    <div>
                      <span className={`text-xs font-bold px-2 py-1 rounded border ${getRiskColor(resource.risk_level)}`}>
                        {resource.risk_level.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      {resource.is_tagged ? (
                        <p className="text-green-400">✅ Tagged</p>
                      ) : (
                        <p className="text-yellow-400">⚠️ Untagged</p>
                      )}
                      {resource.is_public && <p className="text-red-400">🔓 Public</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-lg border border-gray-600 p-12 text-center">
            <p className="text-gray-400 text-lg">No resources match your filters</p>
          </div>
        )}
      </main>
    </div>
  )
}
