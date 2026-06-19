'use client'

import { useState, useEffect } from 'react'
import type { AuditLog } from '@/lib/types'

const API_URL = '/api'

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${API_URL}/audit-logs?platform=aws`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch audit logs')
        }

        const data = await response.json()
        setLogs(Array.isArray(data) ? data : data.logs || [])
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
      <div className="bg-white rounded-lg border border-cyan-400 p-8 text-center">
        <p className="text-black">Loading audit logs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-cyan-400 p-8">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-cyan-400 p-8">
      <h2 className="text-2xl font-bold text-black mb-6">Audit Logs</h2>

      {logs.length === 0 ? (
        <p className="text-black">No audit logs yet</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.auditId} className="border border-cyan-400 rounded-lg p-4 bg-blue-50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-black font-semibold">{log.fullName}</p>
                  <p className="text-blue-400 text-sm">{log.email}</p>
                </div>
                <span className="bg-blue-600 text-black text-xs px-2 py-1 rounded">
                  {log.group}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-black text-sm">
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
                      <p className="text-black">{action.details}</p>
                      <p className="text-gray-500 text-xs">{action.action}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Audit ID */}
              <div className="mt-3 pt-3 border-t border-cyan-400">
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
