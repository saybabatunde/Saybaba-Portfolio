'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DashboardStats {
  pendingRequests: number
  approvedRequests: number
  completedProvisioning: number
  totalResources: number
  estimatedMonthlyCost: number
  highRiskFindings: number
  untaggedResources: number
}

interface RecentActivity {
  id: string
  action: string
  resource: string
  timestamp: string
  status: 'success' | 'pending' | 'failed'
}

export default function MultiCloudHub() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    pendingRequests: 3,
    approvedRequests: 7,
    completedProvisioning: 5,
    totalResources: 24,
    estimatedMonthlyCost: 4250.50,
    highRiskFindings: 2,
    untaggedResources: 8,
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      action: 'Onboarding Request Created',
      resource: 'Sarah Johnson - Finance Analyst',
      timestamp: '2 hours ago',
      status: 'success',
    },
    {
      id: '2',
      action: 'Provisioning Run Completed',
      resource: 'Mike Chen - Senior Engineer',
      timestamp: '5 hours ago',
      status: 'success',
    },
    {
      id: '3',
      action: 'Request Approved',
      resource: 'Emma Wilson - Product Manager',
      timestamp: '1 day ago',
      status: 'success',
    },
    {
      id: '4',
      action: 'High-Risk Finding Detected',
      resource: 'AWS Lambda - untagged-function-001',
      timestamp: '1 day ago',
      status: 'failed',
    },
  ])

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

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-blue-900 border-b border-purple-500 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              🌐 Multi-Cloud IAM Hub
            </h1>
            <p className="text-purple-200 text-sm mt-1">Identity & Infrastructure Automation Dashboard</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('logged_in')
              localStorage.removeItem('username')
              router.push('/')
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-gray-400">Monitor onboarding, provisioning, cloud resources, and compliance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Pending Requests */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg border border-blue-500 p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">📋</span>
              <span className="text-blue-400 text-sm font-semibold">PENDING</span>
            </div>
            <p className="text-gray-300 text-sm mb-2">Onboarding Requests</p>
            <p className="text-4xl font-bold text-white">{stats.pendingRequests}</p>
            <p className="text-blue-300 text-xs mt-3">Awaiting approval</p>
          </div>

          {/* Approved Requests */}
          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg border border-green-500 p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">✅</span>
              <span className="text-green-400 text-sm font-semibold">APPROVED</span>
            </div>
            <p className="text-gray-300 text-sm mb-2">Approved Requests</p>
            <p className="text-4xl font-bold text-white">{stats.approvedRequests}</p>
            <p className="text-green-300 text-xs mt-3">Ready to provision</p>
          </div>

          {/* Completed Provisioning */}
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg border border-purple-500 p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">🚀</span>
              <span className="text-purple-400 text-sm font-semibold">COMPLETED</span>
            </div>
            <p className="text-gray-300 text-sm mb-2">Provisioning Runs</p>
            <p className="text-4xl font-bold text-white">{stats.completedProvisioning}</p>
            <p className="text-purple-300 text-xs mt-3">Successfully deployed</p>
          </div>

          {/* High Risk Findings */}
          <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-lg border border-red-500 p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">⚠️</span>
              <span className="text-red-400 text-sm font-semibold">RISK</span>
            </div>
            <p className="text-gray-300 text-sm mb-2">High-Risk Findings</p>
            <p className="text-4xl font-bold text-white">{stats.highRiskFindings}</p>
            <p className="text-red-300 text-xs mt-3">Require attention</p>
          </div>

          {/* Total Resources */}
          <div className="bg-gradient-to-br from-cyan-900 to-cyan-800 rounded-lg border border-cyan-500 p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">☁️</span>
              <span className="text-cyan-400 text-sm font-semibold">TOTAL</span>
            </div>
            <p className="text-gray-300 text-sm mb-2">Cloud Resources</p>
            <p className="text-4xl font-bold text-white">{stats.totalResources}</p>
            <p className="text-cyan-300 text-xs mt-3">Multi-cloud inventory</p>
          </div>

          {/* Estimated Cost */}
          <div className="bg-gradient-to-br from-amber-900 to-amber-800 rounded-lg border border-amber-500 p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">💰</span>
              <span className="text-amber-400 text-sm font-semibold">MONTHLY</span>
            </div>
            <p className="text-gray-300 text-sm mb-2">Estimated Cost</p>
            <p className="text-4xl font-bold text-white">${stats.estimatedMonthlyCost.toFixed(2)}</p>
            <p className="text-amber-300 text-xs mt-3">Azure + AWS + Vercel</p>
          </div>

          {/* Untagged Resources */}
          <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg border border-orange-500 p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">🏷️</span>
              <span className="text-orange-400 text-sm font-semibold">COMPLIANCE</span>
            </div>
            <p className="text-gray-300 text-sm mb-2">Untagged Resources</p>
            <p className="text-4xl font-bold text-white">{stats.untaggedResources}</p>
            <p className="text-orange-300 text-xs mt-3">Need tagging</p>
          </div>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-lg border border-purple-500 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>⚡</span> Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/multicloud-hub/requests/new"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition text-center"
                >
                  + New Onboarding Request
                </Link>
                <Link
                  href="/multicloud-hub/requests"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition text-center"
                >
                  View All Requests
                </Link>
                <Link
                  href="/multicloud-hub/role-mapping"
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition text-center"
                >
                  Manage Role Mapping
                </Link>
                <Link
                  href="/multicloud-hub/provisioning"
                  className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition text-center"
                >
                  View Provisioning Runs
                </Link>
                <Link
                  href="/multicloud-hub/cloud-inventory"
                  className="block w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition text-center"
                >
                  Cloud Inventory
                </Link>
                <Link
                  href="/multicloud-hub/audit-logs"
                  className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition text-center"
                >
                  Audit Logs
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-lg border border-cyan-500 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>📊</span> Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="border-l-4 border-purple-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-semibold">{activity.action}</p>
                        <p className="text-gray-400 text-sm">{activity.resource}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          activity.status === 'success'
                            ? 'bg-green-900/30 text-green-400'
                            : activity.status === 'pending'
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-red-900/30 text-red-400'
                        }`}
                      >
                        {activity.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">{activity.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* What This Hub Does */}
          <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-3">🎯 What This Hub Does</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>✅ Automate user onboarding across Entra ID, AD, and M365</li>
              <li>✅ Map roles to groups, licenses, and cloud access</li>
              <li>✅ Simulate provisioning workflows with approval gates</li>
              <li>✅ Track cloud resources across Azure, AWS, Vercel</li>
              <li>✅ Monitor costs and compliance violations</li>
              <li>✅ Maintain comprehensive audit logs for security</li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-3">🛠️ Tech Stack</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <p><span className="text-purple-400 font-semibold">Frontend:</span> Next.js + Vercel</p>
              <p><span className="text-purple-400 font-semibold">Database:</span> Supabase PostgreSQL</p>
              <p><span className="text-purple-400 font-semibold">Auth:</span> Supabase Auth</p>
              <p><span className="text-purple-400 font-semibold">Serverless:</span> Azure Functions + AWS Lambda</p>
              <p><span className="text-purple-400 font-semibold">IaC:</span> Terraform</p>
              <p><span className="text-purple-400 font-semibold">CI/CD:</span> GitHub Actions</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 Multi-Cloud Identity & Infrastructure Automation Hub</p>
        </div>
      </footer>
    </div>
  )
}
