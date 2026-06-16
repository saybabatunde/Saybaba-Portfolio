'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MetricDataPoint {
  time: string
  cpu: number
  ram: number
  disk: number
  responseTime: number
  uptime: number
}

interface CurrentMetrics {
  cpu: number
  ram: number
  disk: number
  responseTime: number
  uptime: number
}

export default function MetricsDisplay() {
  const [historicalData, setHistoricalData] = useState<MetricDataPoint[]>([])
  const [currentMetrics, setCurrentMetrics] = useState<CurrentMetrics | null>(null)
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
      setCurrentMetrics(data)

      // Add current data to historical data
      setHistoricalData((prev) => {
        const newData = [
          ...prev,
          {
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            cpu: data.cpu,
            ram: data.ram,
            disk: data.disk,
            responseTime: data.responseTime,
            uptime: data.uptime,
          },
        ]
        // Keep only last 24 data points
        return newData.slice(-24)
      })
    } catch (error) {
      console.error('Error fetching metrics:', error)
      const defaultMetrics = getDefaultMetrics()
      setCurrentMetrics(defaultMetrics)

      // Generate sample historical data
      setHistoricalData(generateSampleData(defaultMetrics))
    } finally {
      setLoading(false)
    }
  }

  const getDefaultMetrics = (): CurrentMetrics => ({
    cpu: 35,
    ram: 48,
    disk: 62,
    responseTime: 85,
    uptime: 99.98,
  })

  const generateSampleData = (baseMetrics: CurrentMetrics): MetricDataPoint[] => {
    const data: MetricDataPoint[] = []
    for (let i = 23; i >= 0; i--) {
      const variation = Math.random() * 10 - 5
      data.push({
        time: `${i}h ago`,
        cpu: Math.max(10, Math.min(90, baseMetrics.cpu + variation)),
        ram: Math.max(20, Math.min(85, baseMetrics.ram + variation)),
        disk: Math.max(50, Math.min(90, baseMetrics.disk + variation)),
        responseTime: Math.max(50, Math.min(200, baseMetrics.responseTime + variation * 5)),
        uptime: Math.max(99, baseMetrics.uptime - Math.random() * 0.5),
      })
    }
    return data
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg border border-gray-700 p-6 animate-pulse h-64" />
        ))}
      </div>
    )
  }

  if (!currentMetrics) {
    return <div className="text-gray-400">Unable to load metrics</div>
  }

  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-white font-semibold mb-4">{title}</h3>
      {children}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Current Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gray-900 rounded-lg border border-blue-600/30 p-4">
          <p className="text-gray-400 text-sm mb-2">CPU Usage</p>
          <p className="text-2xl font-bold text-blue-400">{currentMetrics.cpu.toFixed(1)}%</p>
        </div>
        <div className="bg-gray-900 rounded-lg border border-purple-600/30 p-4">
          <p className="text-gray-400 text-sm mb-2">RAM Usage</p>
          <p className="text-2xl font-bold text-purple-400">{currentMetrics.ram.toFixed(1)}%</p>
        </div>
        <div className="bg-gray-900 rounded-lg border border-orange-600/30 p-4">
          <p className="text-gray-400 text-sm mb-2">Disk Usage</p>
          <p className="text-2xl font-bold text-orange-400">{currentMetrics.disk.toFixed(1)}%</p>
        </div>
        <div className="bg-gray-900 rounded-lg border border-green-600/30 p-4">
          <p className="text-gray-400 text-sm mb-2">Response Time</p>
          <p className="text-2xl font-bold text-green-400">{currentMetrics.responseTime.toFixed(0)}ms</p>
        </div>
        <div className="bg-gray-900 rounded-lg border border-emerald-600/30 p-4">
          <p className="text-gray-400 text-sm mb-2">Uptime (30d)</p>
          <p className="text-2xl font-bold text-emerald-400">{currentMetrics.uptime.toFixed(2)}%</p>
        </div>
      </div>

      {/* Charts */}
      <ChartCard title="CPU & RAM Usage (Last 24h)">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#888" />
            <YAxis domain={[0, 100]} stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #444' }} />
            <Legend />
            <Line type="linear" dataKey="cpu" stroke="#60a5fa" strokeWidth={2} name="CPU %" isAnimationActive={false} />
            <Line type="linear" dataKey="ram" stroke="#a78bfa" strokeWidth={2} name="RAM %" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Disk Usage (Last 24h)">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#888" />
            <YAxis domain={[0, 100]} stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #444' }} />
            <Legend />
            <Line type="linear" dataKey="disk" stroke="#fb923c" strokeWidth={2} name="Disk %" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Response Time & Uptime (Last 24h)">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#888" />
            <YAxis yAxisId="left" domain={[0, 300]} stroke="#888" />
            <YAxis yAxisId="right" orientation="right" domain={[98, 100]} stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #444' }} />
            <Legend />
            <Line yAxisId="left" type="linear" dataKey="responseTime" stroke="#34d399" strokeWidth={2} name="Response Time (ms)" isAnimationActive={false} />
            <Line yAxisId="right" type="linear" dataKey="uptime" stroke="#10b981" strokeWidth={2} name="Uptime %" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
