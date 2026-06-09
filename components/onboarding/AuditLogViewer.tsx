'use client'

import { useState, useEffect } from 'react'
import { getAuditLogs } from '@/lib/api'
import type { AuditLog } from '@/lib/types'

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getAuditLogs()
        setLogs(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch audit logs')
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
    const interval = setInterval(fetchLogs, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
        <p className="text-gray-400">Loading audit logs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Audit Logs</h2>

      {logs.length === 0 ? (
        <p className="text-gray-400">No audit logs yet</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.auditId} className="border border-gray-700 rounded-lg p-4 bg-gray-900">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-white font-semibold">{log.fullName}</p>
                  <p className="text-blue-400 text-sm">{log.email}</p>
                </div>
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  {log.group}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-gray-400 text-sm">
                  Created: {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>

              {/* Action Logs */}
              <div className="space-y-2 bg-black/30 rounded p-3 mt-3">
                {log.logs?.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className={action.status === 'SUCCESS' ? 'text-green-400' : 'text-red-400'}>
                      {action.status === 'SUCCESS' ? '✓' : '✗'}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-300">{action.details}</p>
                      <p className="text-gray-500 text-xs">{action.action}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Audit ID */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-gray-500 text-xs break-all">
                  Audit ID: {log.auditId}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
