'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AuditLog {
  id: string
  actor_name: string
  actor_email: string
  action: string
  resource_type: string
  resource_name: string
  status: 'success' | 'failed'
  timestamp: string
  details: string
}

const SAMPLE_LOGS: AuditLog[] = [
  {
    id: '1',
    actor_name: 'Sarah Johnson',
    actor_email: 'sjohnson@company.com',
    action: 'Provisioning Run Completed',
    resource_type: 'provisioning_run',
    resource_name: 'Sarah Johnson - Finance Analyst',
    status: 'success',
    timestamp: '1 hour ago',
    details: '8 steps completed in 1 hour. User ready for first login.',
  },
  {
    id: '2',
    actor_name: 'Admin User',
    actor_email: 'admin@company.com',
    action: 'Request Approved',
    resource_type: 'request',
    resource_name: 'Sarah Johnson - Finance Analyst',
    status: 'success',
    timestamp: '3 hours ago',
    details: 'Approved by Finance Manager. Provisioning will start shortly.',
  },
  {
    id: '3',
    actor_name: 'System',
    actor_email: 'system@company.com',
    action: 'Onboarding Request Created',
    resource_type: 'request',
    resource_name: 'Sarah Johnson - Finance Analyst',
    status: 'success',
    timestamp: '5 hours ago',
    details: 'New request submitted by HR. Pending approval from Finance Manager.',
  },
  {
    id: '4',
    actor_name: 'Mike Chen',
    actor_email: 'mchen@company.com',
    action: 'High-Risk Finding Detected',
    resource_type: 'finding',
    resource_name: 'AWS Lambda - untagged-function-001',
    status: 'failed',
    timestamp: '1 day ago',
    details: 'Resource is missing required tags: Environment, Team, Owner.',
  },
  {
    id: '5',
    actor_name: 'Admin User',
    actor_email: 'admin@company.com',
    action: 'Role Mapping Updated',
    resource_type: 'role_mapping',
    resource_name: 'Finance Analyst - Canada',
    status: 'success',
    timestamp: '2 days ago',
    details: 'Added new Entra group: Finance-Analytics-Access. Updated M365 license to E5.',
  },
  {
    id: '6',
    actor_name: 'System',
    actor_email: 'system@company.com',
    action: 'Provisioning Run Completed',
    resource_type: 'provisioning_run',
    resource_name: 'Mike Chen - Senior Engineer',
    status: 'success',
    timestamp: '3 days ago',
    details: '8 steps completed in 45 minutes. User ready for first login.',
  },
  {
    id: '7',
    actor_name: 'Emma Wilson',
    actor_email: 'emma.wilson@company.com',
    action: 'Request Rejected',
    resource_type: 'request',
    resource_name: 'Test User - Product Manager',
    status: 'failed',
    timestamp: '4 days ago',
    details: 'Rejected: Manager approval missing. Please resubmit with manager sign-off.',
  },
  {
    id: '8',
    actor_name: 'Admin User',
    actor_email: 'admin@company.com',
    action: 'Cloud Resource Scanned',
    resource_type: 'resource',
    resource_name: 'Azure-VMs',
    status: 'success',
    timestamp: '5 days ago',
    details: 'Scanned 24 resources. Found 8 untagged, 2 public, 1 high-risk IAM assignment.',
  },
]

export default function AuditLogs() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [logs, setLogs] = useState<AuditLog[]>(SAMPLE_LOGS)
  const [filterAction, setFilterAction] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')

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

  const filteredLogs = logs.filter((log) => {
    const matchesAction = !filterAction || log.action.includes(filterAction)
    const matchesStatus = !filterStatus || log.status === filterStatus
    const matchesSearch =
      !searchText ||
      log.actor_name.toLowerCase().includes(searchText.toLowerCase()) ||
      log.resource_name.toLowerCase().includes(searchText.toLowerCase())

    return matchesAction && matchesStatus && matchesSearch
  })

  const getActionIcon = (action: string) => {
    if (action.includes('Created')) return '📝'
    if (action.includes('Approved')) return '✅'
    if (action.includes('Rejected')) return '❌'
    if (action.includes('Completed')) return '🚀'
    if (action.includes('Updated')) return '✏️'
    if (action.includes('Detected')) return '⚠️'
    if (action.includes('Scanned')) return '📊'
    return '📋'
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-slate-900 border-b border-gray-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/multicloud-hub"
            className="text-gray-300 hover:text-gray-200 font-semibold transition flex items-center gap-2 mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
          <p className="text-gray-400 text-sm mt-2">Complete activity history for compliance and troubleshooting</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Info Banner */}
        <div className="bg-gray-900/20 border border-gray-500 rounded-lg p-6 mb-8">
          <h3 className="text-white font-bold mb-2">📜 Audit Trail</h3>
          <p className="text-gray-300 text-sm">
            Every action in the system is logged for security, compliance, and troubleshooting. Audit logs track who
            did what, when, and the result. Use filters to find specific events.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 rounded-lg border border-gray-600 p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">🔍 Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">Search by Name or Resource</label>
              <input
                type="text"
                placeholder="e.g., Sarah, Finance"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">Filter by Action</label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400"
              >
                <option value="">All Actions</option>
                <option value="Created">Created</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
                <option value="Updated">Updated</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400"
              >
                <option value="">All Statuses</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-slate-900 rounded-lg border border-gray-600 overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-6 gap-4 bg-slate-800 border-b border-gray-600 p-4 font-bold text-gray-300 text-sm">
            <div>Actor</div>
            <div>Action</div>
            <div>Resource</div>
            <div>Status</div>
            <div>Timestamp</div>
            <div>Details</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-600">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-800/50 transition">
                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-2 mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-semibold text-sm">{log.actor_name}</p>
                        <p className="text-gray-400 text-xs">{log.actor_email}</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          log.status === 'success'
                            ? 'bg-green-900/30 text-green-400 border border-green-600'
                            : 'bg-red-900/30 text-red-400 border border-red-600'
                        }`}
                      >
                        {log.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white font-semibold">
                      {getActionIcon(log.action)} {log.action}
                    </p>
                    <p className="text-gray-400 text-sm">{log.resource_name}</p>
                    <p className="text-gray-500 text-xs">{log.timestamp}</p>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:grid grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="text-white font-semibold text-sm">{log.actor_name}</p>
                      <p className="text-gray-400 text-xs">{log.actor_email}</p>
                    </div>

                    <div className="text-white text-sm">
                      {getActionIcon(log.action)} {log.action}
                    </div>

                    <div className="text-gray-300 text-sm">{log.resource_name}</div>

                    <div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          log.status === 'success'
                            ? 'bg-green-900/30 text-green-400 border border-green-600'
                            : 'bg-red-900/30 text-red-400 border border-red-600'
                        }`}
                      >
                        {log.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-gray-400 text-sm">{log.timestamp}</div>

                    <div className="text-gray-400 text-sm truncate" title={log.details}>
                      {log.details}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-400">No audit logs found matching your filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-slate-900 rounded-lg border border-gray-600 p-6">
            <p className="text-gray-400 text-sm mb-2">Total Logs</p>
            <p className="text-4xl font-bold text-white">{logs.length}</p>
          </div>
          <div className="bg-green-900/20 rounded-lg border border-green-600 p-6">
            <p className="text-green-300 text-sm mb-2">Successful Actions</p>
            <p className="text-4xl font-bold text-green-400">
              {logs.filter((l) => l.status === 'success').length}
            </p>
          </div>
          <div className="bg-red-900/20 rounded-lg border border-red-600 p-6">
            <p className="text-red-300 text-sm mb-2">Failed Actions</p>
            <p className="text-4xl font-bold text-red-400">
              {logs.filter((l) => l.status === 'failed').length}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
