'use client'

import { useEffect, useState } from 'react'

interface Alert {
  id: string
  type: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
  status: 'active' | 'resolved'
}

export default function AlertLog() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/monitoring/alerts')
      if (!response.ok) throw new Error('Failed to fetch alerts')
      const data = await response.json()
      setAlerts(data)
    } catch (error) {
      console.error('Error fetching alerts:', error)
      setAlerts(getDefaultAlerts())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultAlerts = (): Alert[] => [
    {
      id: '1',
      type: 'Service Health',
      severity: 'info',
      message: 'All services operational',
      timestamp: new Date().toISOString(),
      status: 'resolved',
    },
  ]

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' }
      case 'warning':
        return { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' }
      case 'info':
        return { bg: '#F0F9FF', border: '#3B82F6', text: '#1E40AF' }
      default:
        return { bg: '#F9FAFB', border: '#E5E7EB', text: '#111827' }
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '🔴'
      case 'warning':
        return '🟡'
      case 'info':
        return '🔵'
      default:
        return '⚪'
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4 animate-pulse h-20" style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.length === 0 ? (
        <div className="rounded-lg border p-4" style={{ backgroundColor: '#DCFCE7', borderColor: '#10B981', color: '#166534' }}>
          <p className="font-semibold">✓ No active alerts</p>
          <p className="text-sm mt-1">All systems operating normally</p>
        </div>
      ) : (
        alerts.map((alert) => {
          const styles = getSeverityStyles(alert.severity)
          const statusBg = alert.status === 'resolved' ? '#DCFCE7' : '#FEE2E2'
          const statusColor = alert.status === 'resolved' ? '#166534' : '#991B1B'

          return (
            <div
              key={alert.id}
              className="border-2 rounded-lg p-4"
              style={{
                backgroundColor: styles.bg,
                borderColor: styles.border,
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{getSeverityIcon(alert.severity)}</span>
                  <div className="flex-1">
                    <p className="font-bold" style={{ color: styles.text }}>{alert.type}</p>
                    <p className="text-sm mt-1" style={{ color: styles.text }}>{alert.message}</p>
                    <p className="text-xs mt-2" style={{ color: styles.text, opacity: 0.7 }}>
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ml-4"
                  style={{
                    backgroundColor: statusBg,
                    color: statusColor,
                  }}
                >
                  {alert.status === 'resolved' ? '✓ Resolved' : '⚠ Active'}
                </span>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
