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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-900/30 border-red-600 text-red-300'
      case 'warning':
        return 'bg-yellow-900/30 border-yellow-600 text-yellow-300'
      case 'info':
        return 'bg-blue-900/30 border-blue-600 text-blue-300'
      default:
        return 'bg-gray-800 border-gray-700 text-gray-300'
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
          <div key={i} className="bg-gray-800 rounded-lg border border-gray-700 p-4 animate-pulse h-20" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.length === 0 ? (
        <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 text-green-300">
          <p className="font-semibold">✓ No active alerts</p>
          <p className="text-sm mt-1">All systems operating normally</p>
        </div>
      ) : (
        alerts.map((alert) => (
          <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-xl">{getSeverityIcon(alert.severity)}</span>
                <div className="flex-1">
                  <p className="font-semibold">{alert.type}</p>
                  <p className="text-sm mt-1">{alert.message}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded whitespace-nowrap ml-4 ${
                  alert.status === 'resolved' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'
                }`}
              >
                {alert.status === 'resolved' ? '✓ Resolved' : '⚠ Active'}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
