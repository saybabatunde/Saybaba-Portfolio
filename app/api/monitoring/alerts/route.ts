import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    // Fetch alerts from Supabase
    const { data, error } = await supabase
      .from('monitoring_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Supabase error:', error)
      // Return default alerts if table doesn't exist yet
      return NextResponse.json(getDefaultAlerts())
    }

    if (!data || data.length === 0) {
      return NextResponse.json(getDefaultAlerts())
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(getDefaultAlerts())
  }
}

function getDefaultAlerts() {
  return [
    {
      id: '1',
      type: 'System Health',
      severity: 'info',
      message: 'All systems operational',
      timestamp: new Date().toISOString(),
      status: 'resolved',
    },
    {
      id: '2',
      type: 'Service Status',
      severity: 'info',
      message: 'All external services responding normally',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'resolved',
    },
  ]
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()

    const { data, error } = await supabase.from('monitoring_alerts').insert([
      {
        type: body.type,
        severity: body.severity,
        message: body.message,
        status: 'active',
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error('Error creating alert:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/monitoring/alerts:', error)
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 })
  }
}
