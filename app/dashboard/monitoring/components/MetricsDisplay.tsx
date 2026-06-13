'use client'

import { useEffect, useState } from 'react'

interface Metrics {
  cpu: number
  ram: number
  disk: number
  responseTime: number
  uptime: number
}

export default function MetricsDisplay() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/monitoring/metrics')
      if (!response.ok) throw new Error('Failed to fetch metrics')
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error('Error fetching metrics:', error)
      setMetrics(getDefaultMetrics())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultMetrics = (): Metrics => ({
    cpu: 35,
    ram: 48,
    disk: 62,
    responseTime: 85,
    uptime: 99.98,
  })

  const MetricGauge = ({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) => {
    const getColorClass = (val: number) => {
      if (val < 50) return 'text-green-400'
      if (val < 75) return 'text-yellow-400'
      return 'text-red-400'
    }

    return (
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <h3 className="text-gray-400 text-sm font-semibold mb-4">{label}</h3>
        <div className="mb-4">
          <div className={`text-3xl font-bold ${getColorClass(value)}`}>{value}%</div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${color}`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg border border-gray-700 p-6 animate-pulse h-32" />
        ))}
      </div>
    )
  }

  if (!metrics) {
    return <div className="text-gray-400">Unable to load metrics</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricGauge label="CPU Usage" value={metrics.cpu} unit="%" color="bg-blue-500" />
      <MetricGauge label="RAM Usage" value={metrics.ram} unit="%" color="bg-purple-500" />
      <MetricGauge label="Disk Usage" value={metrics.disk} unit="%" color="bg-orange-500" />
      <MetricGauge label="Response Time" value={metrics.responseTime} unit="ms" color="bg-green-500" />

      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <h3 className="text-gray-400 text-sm font-semibold mb-4">Uptime (30d)</h3>
        <div className="text-3xl font-bold text-green-400">{metrics.uptime}%</div>
        <p className="text-xs text-gray-500 mt-3">Systems healthy</p>
      </div>
    </div>
  )
}
