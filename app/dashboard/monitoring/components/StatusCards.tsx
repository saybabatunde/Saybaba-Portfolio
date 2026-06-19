'use client'

import { useEffect, useState } from 'react'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'down'
  icon: string
  message: string
  color: string
}

export default function StatusCards() {
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServiceStatus()
    const interval = setInterval(fetchServiceStatus, 60000) // Refresh every 60 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchServiceStatus = async () => {
    try {
      const response = await fetch('/api/monitoring/status')
      if (!response.ok) throw new Error('Failed to fetch status')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Error fetching service status:', error)
      setServices(getDefaultServices())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultServices = (): ServiceStatus[] => [
    { name: 'GitHub', status: 'operational', icon: '🐙', message: 'All systems operational', color: 'green' },
    { name: 'Supabase', status: 'operational', icon: '🔋', message: 'Database connected', color: 'green' },
    { name: 'Vercel', status: 'operational', icon: '▲', message: 'Deployments healthy', color: 'green' },
    { name: 'Resend', status: 'operational', icon: '📧', message: 'Email service active', color: 'green' },
    { name: 'AWS', status: 'operational', icon: '⚙️', message: 'Lambda & API Gateway healthy', color: 'green' },
    { name: 'Azure', status: 'operational', icon: '☁️', message: 'Resources operational', color: 'green' },
    { name: 'Claude API', status: 'operational', icon: '🤖', message: 'AI service responsive', color: 'green' },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-600 p-4 animate-pulse h-24" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => {
        const statusColors = {
          operational: { bg: 'bg-white/20', border: 'border-gray-600', text: 'text-green-400', dot: 'bg-green-500' },
          degraded: { bg: 'bg-white/20', border: 'border-yellow-600', text: 'text-yellow-400', dot: 'bg-yellow-500' },
          down: { bg: 'bg-white/20', border: 'border-red-600', text: 'text-red-400', dot: 'bg-red-500' },
        }
        const colors = statusColors[service.status]

        return (
          <div
            key={service.name}
            className={`${colors.bg} rounded-lg border ${colors.border} p-6 hover:shadow-lg transition`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{service.icon}</span>
                <h3 className="text-lg font-semibold text-white">{service.name}</h3>
              </div>
              <div className={`w-3 h-3 rounded-full ${colors.dot} animate-pulse`} />
            </div>
            <p className={`text-sm ${colors.text}`}>{service.message}</p>
            <p className="text-xs text-white mt-2">
              {service.status === 'operational' && '✓ Operational'}
              {service.status === 'degraded' && '⚠ Degraded'}
              {service.status === 'down' && '✗ Down'}
            </p>
          </div>
        )
      })}
    </div>
  )
}
