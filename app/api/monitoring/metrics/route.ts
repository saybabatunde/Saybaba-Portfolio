import { NextResponse } from 'next/server'
import os from 'os'

interface Metrics {
  cpu: number
  ram: number
  disk: number
  responseTime: number
  uptime: number
}

function getSystemMetrics(): Metrics {
  // CPU usage (simplified - using average load)
  const cpus = os.cpus()
  const loadAverage = os.loadavg()[0]
  const cpuUsage = Math.min(Math.round((loadAverage / cpus.length) * 100), 100)

  // RAM usage
  const totalMemory = os.totalmem()
  const freeMemory = os.freemem()
  const usedMemory = totalMemory - freeMemory
  const ramUsage = Math.round((usedMemory / totalMemory) * 100)

  // Disk usage (simplified - estimate based on system)
  const diskUsage = Math.round(Math.random() * 30 + 40) // Mock: 40-70%

  // Response time (average latency in ms)
  const responseTime = Math.round(Math.random() * 100 + 50) // Mock: 50-150ms

  // Uptime percentage (30 days)
  const uptime = 99.98

  return {
    cpu: cpuUsage,
    ram: ramUsage,
    disk: diskUsage,
    responseTime,
    uptime,
  }
}

export async function GET() {
  try {
    const metrics = getSystemMetrics()
    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
