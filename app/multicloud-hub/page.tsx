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
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: '#FFFFFF', borderBottom: '3px solid #6366F1' }}>
        <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3" style={{ color: '#6366F1' }}>
              🌐 Multi-Cloud IAM Hub
            </h1>
            <p className="text-base mt-2" style={{ color: '#4B5563' }}>Identity & Infrastructure Automation Dashboard</p>
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
          <h2 className="text-4xl font-bold mb-2" style={{ color: '#B19CD9' }}>Dashboard</h2>
          <p style={{ color: '#6B5B7C' }}>Monitor onboarding, provisioning, cloud resources, and compliance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Pending Requests */}
          <div className="rounded-lg border-2 p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#F59E0B', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.1)' }}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">📋</span>
              <span className="text-sm font-bold px-3 py-1 rounded" style={{ color: '#FFFFFF', backgroundColor: '#F59E0B' }}>PENDING</span>
            </div>
            <p className="text-sm mb-2" style={{ color: '#6B7280' }}>Onboarding Requests</p>
            <p className="text-4xl font-bold" style={{ color: '#F59E0B' }}>{stats.pendingRequests}</p>
            <p className="text-xs mt-3" style={{ color: '#92400E' }}>Awaiting approval</p>
          </div>

          {/* Approved Requests */}
          <div className="rounded-lg border-2 p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#10B981', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)' }}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">✅</span>
              <span className="text-sm font-bold px-3 py-1 rounded" style={{ color: '#FFFFFF', backgroundColor: '#10B981' }}>APPROVED</span>
            </div>
            <p className="text-sm mb-2" style={{ color: '#6B7280' }}>Approved Requests</p>
            <p className="text-4xl font-bold" style={{ color: '#10B981' }}>{stats.approvedRequests}</p>
            <p className="text-xs mt-3" style={{ color: '#047857' }}>Ready to provision</p>
          </div>

          {/* Completed Provisioning */}
          <div className="rounded-lg border-2 p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#3B82F6', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)' }}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">🚀</span>
              <span className="text-sm font-bold px-3 py-1 rounded" style={{ color: '#FFFFFF', backgroundColor: '#3B82F6' }}>COMPLETED</span>
            </div>
            <p className="text-sm mb-2" style={{ color: '#6B7280' }}>Provisioning Runs</p>
            <p className="text-4xl font-bold" style={{ color: '#3B82F6' }}>{stats.completedProvisioning}</p>
            <p className="text-xs mt-3" style={{ color: '#1E40AF' }}>Successfully deployed</p>
          </div>

          {/* High Risk Findings */}
          <div className="rounded-lg border-2 p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#EF4444', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)' }}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">⚠️</span>
              <span className="text-sm font-bold px-3 py-1 rounded" style={{ color: '#FFFFFF', backgroundColor: '#EF4444' }}>RISK</span>
            </div>
            <p className="text-sm mb-2" style={{ color: '#6B5B7C' }}>High-Risk Findings</p>
            <p className="text-4xl font-bold" style={{ color: '#B19CD9' }}>{stats.highRiskFindings}</p>
            <p className="text-xs mt-3" style={{ color: '#9370DB' }}>Require attention</p>
          </div>

          {/* Total Resources */}
          <div className="rounded-lg border-2 p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#6366F1', boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)' }}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">☁️</span>
              <span className="text-sm font-bold px-3 py-1 rounded" style={{ color: '#FFFFFF', backgroundColor: '#6366F1' }}>TOTAL</span>
            </div>
            <p className="text-sm mb-2" style={{ color: '#6B7280' }}>Cloud Resources</p>
            <p className="text-4xl font-bold" style={{ color: '#6366F1' }}>{stats.totalResources}</p>
            <p className="text-xs mt-3" style={{ color: '#4338CA' }}>Multi-cloud inventory</p>
          </div>

          {/* Estimated Cost */}
          <div className="rounded-lg border-2 p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#A855F7', boxShadow: '0 2px 8px rgba(168, 85, 247, 0.1)' }}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">💰</span>
              <span className="text-sm font-bold px-3 py-1 rounded" style={{ color: '#FFFFFF', backgroundColor: '#A855F7' }}>MONTHLY</span>
            </div>
            <p className="text-sm mb-2" style={{ color: '#6B7280' }}>Estimated Cost</p>
            <p className="text-4xl font-bold" style={{ color: '#A855F7' }}>${stats.estimatedMonthlyCost.toFixed(2)}</p>
            <p className="text-xs mt-3" style={{ color: '#6D28D9' }}>Azure + AWS + Vercel</p>
          </div>

          {/* Untagged Resources */}
          <div className="rounded-lg border-2 p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#64748B', boxShadow: '0 2px 8px rgba(100, 116, 139, 0.1)' }}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">🏷️</span>
              <span className="text-sm font-bold px-3 py-1 rounded" style={{ color: '#FFFFFF', backgroundColor: '#64748B' }}>COMPLIANCE</span>
            </div>
            <p className="text-sm mb-2" style={{ color: '#6B7280' }}>Untagged Resources</p>
            <p className="text-4xl font-bold" style={{ color: '#64748B' }}>{stats.untaggedResources}</p>
            <p className="text-xs mt-3" style={{ color: '#334155' }}>Need tagging</p>
          </div>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#B19CD9', boxShadow: '0 2px 8px rgba(177, 156, 217, 0.1)' }}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#B19CD9' }}>
                <span>⚡</span> Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/multicloud-hub/requests/new"
                  className="block w-full text-white font-semibold py-3 px-4 rounded-lg transition text-center"
                  style={{ backgroundColor: '#B19CD9' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9370DB')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#B19CD9')}
                >
                  + New Onboarding Request
                </Link>
                <Link
                  href="/multicloud-hub/requests"
                  className="block w-full text-white font-semibold py-3 px-4 rounded-lg transition text-center"
                  style={{ backgroundColor: '#B19CD9' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9370DB')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#B19CD9')}
                >
                  View All Requests
                </Link>
                <Link
                  href="/multicloud-hub/role-mapping"
                  className="block w-full text-white font-semibold py-3 px-4 rounded-lg transition text-center"
                  style={{ backgroundColor: '#B19CD9' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9370DB')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#B19CD9')}
                >
                  Manage Role Mapping
                </Link>
                <Link
                  href="/multicloud-hub/provisioning"
                  className="block w-full text-white font-semibold py-3 px-4 rounded-lg transition text-center"
                  style={{ backgroundColor: '#B19CD9' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9370DB')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#B19CD9')}
                >
                  View Provisioning Runs
                </Link>
                <Link
                  href="/multicloud-hub/cloud-inventory"
                  className="block w-full text-white font-semibold py-3 px-4 rounded-lg transition text-center"
                  style={{ backgroundColor: '#B19CD9' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9370DB')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#9370DB')}
                >
                  Cloud Inventory
                </Link>
                <Link
                  href="/multicloud-hub/audit-logs"
                  className="block w-full text-white font-semibold py-3 px-4 rounded-lg transition text-center"
                  style={{ backgroundColor: '#B19CD9' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9370DB')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#B19CD9')}
                >
                  Audit Logs
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#B19CD9', boxShadow: '0 2px 8px rgba(177, 156, 217, 0.1)' }}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#B19CD9' }}>
                <span>📊</span> Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="border-l-4 pl-4 py-2" style={{ borderColor: '#B19CD9' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold" style={{ color: '#3B3B4D' }}>{activity.action}</p>
                        <p className="text-sm" style={{ color: '#6B5B7C' }}>{activity.resource}</p>
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
                    <p className="text-xs mt-2" style={{ color: '#9370DB' }}>{activity.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* What This Hub Does */}
          <div className="rounded-lg border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#B19CD9', boxShadow: '0 2px 8px rgba(177, 156, 217, 0.1)' }}>
            <h3 className="text-lg font-bold mb-3" style={{ color: '#B19CD9' }}>🎯 What This Hub Does</h3>
            <ul className="space-y-2 text-sm" style={{ color: '#3B3B4D' }}>
              <li>✅ Automate user onboarding across Entra ID, AD, and M365</li>
              <li>✅ Map roles to groups, licenses, and cloud access</li>
              <li>✅ Simulate provisioning workflows with approval gates</li>
              <li>✅ Track cloud resources across Azure, AWS, Vercel</li>
              <li>✅ Monitor costs and compliance violations</li>
              <li>✅ Maintain comprehensive audit logs for security</li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="rounded-lg border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#B19CD9', boxShadow: '0 2px 8px rgba(177, 156, 217, 0.1)' }}>
            <h3 className="text-lg font-bold mb-3" style={{ color: '#B19CD9' }}>🛠️ Tech Stack</h3>
            <div className="space-y-2 text-sm" style={{ color: '#3B3B4D' }}>
              <p><span className="font-semibold" style={{ color: '#B19CD9' }}>Frontend:</span> Next.js + Vercel</p>
              <p><span className="font-semibold" style={{ color: '#B19CD9' }}>Database:</span> Supabase PostgreSQL</p>
              <p><span className="font-semibold" style={{ color: '#B19CD9' }}>Auth:</span> Supabase Auth</p>
              <p><span className="font-semibold" style={{ color: '#B19CD9' }}>Serverless:</span> Azure Functions + AWS Lambda</p>
              <p><span className="font-semibold" style={{ color: '#B19CD9' }}>IaC:</span> Terraform</p>
              <p><span className="font-semibold" style={{ color: '#B19CD9' }}>CI/CD:</span> GitHub Actions</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-4 text-center text-sm" style={{ color: '#9CA3AF' }}>
          <p>© 2026 Multi-Cloud Identity & Infrastructure Automation Hub</p>
        </div>
      </footer>
    </div>
  )
}
