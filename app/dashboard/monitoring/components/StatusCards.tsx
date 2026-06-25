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
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    fetchServiceStatus()
    const interval = setInterval(fetchServiceStatus, 60000) // Refresh every 60 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 60))
    }, 1000)
    return () => clearInterval(countdownInterval)
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
          <div key={i} className="rounded-lg border p-4 animate-pulse h-24" style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => {
        // Service-specific background colors
        const serviceBackgrounds: { [key: string]: string } = {
          'GitHub': '#A6DAF8',
          'Supabase': '#D0F0C0',
          'Vercel': '#1a1a1a',
          'Resend': '#838996',
          'AWS': '#FFA500',
          'Azure': '#74BFEA',
          'Claude API': '#E8D5FF',
        }

        const serviceTextColors: { [key: string]: string } = {
          'GitHub': '#0C4A6E',
          'Supabase': '#166534',
          'Vercel': '#E5E7EB',
          'Resend': '#FFFFFF',
          'AWS': '#7C2D12',
          'Azure': '#0C4A6E',
          'Claude API': '#5B21B6',
        }

        const serviceBorderColors: { [key: string]: string } = {
          'GitHub': '#0284C7',
          'Supabase': '#10B981',
          'Vercel': '#4B5563',
          'Resend': '#6B7280',
          'AWS': '#EA580C',
          'Azure': '#0891B2',
          'Claude API': '#A855F7',
        }

        const bgColor = serviceBackgrounds[service.name] || '#F9FAFB'
        const textColor = serviceTextColors[service.name] || '#111827'
        const borderColor = serviceBorderColors[service.name] || '#E5E7EB'

        // Status colors (for status badge)
        const statusColors = {
          operational: {
            border: borderColor,
            text: textColor,
            dot: borderColor,
            badge: borderColor
          },
          degraded: {
            border: borderColor,
            text: textColor,
            dot: '#F59E0B',
            badge: '#F59E0B'
          },
          down: {
            border: borderColor,
            text: textColor,
            dot: '#EF4444',
            badge: '#EF4444'
          },
        }
        const colors = statusColors[service.status]

        return (
          <div
            key={service.name}
            className="rounded-lg border-2 p-6 hover:shadow-lg transition relative"
            style={{
              backgroundColor: bgColor,
              borderColor: borderColor,
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{service.icon}</span>
                <h3 className="text-lg font-bold" style={{ color: textColor }}>{service.name}</h3>
              </div>
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: borderColor }}
              />
            </div>
            <p className="text-sm mb-3" style={{ color: textColor }}>{service.message}</p>
            <div className="flex items-end justify-between">
              <div
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: colors.badge,
                  color: '#FFFFFF',
                }}
              >
                {service.status === 'operational' && '✓ Operational'}
                {service.status === 'degraded' && '⚠ Degraded'}
                {service.status === 'down' && '✗ Down'}
              </div>

              {/* Countdown Timer - Bottom Right */}
              <div
                className="text-xs font-mono px-2 py-1 rounded"
                style={{
                  backgroundColor: borderColor,
                  color: '#FFFFFF',
                  opacity: 0.8,
                }}
              >
                {countdown}s
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
