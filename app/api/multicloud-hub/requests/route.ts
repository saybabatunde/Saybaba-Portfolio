import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      employee_name,
      employee_email,
      department,
      job_title,
      location,
      worker_type,
      start_date,
      manager_name,
      manager_email,
    } = body

    if (!employee_name || !employee_email || !department || !job_title || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Map role to suggestions
    const suggested_ad_ou = `OU=${department},OU=Users,DC=company,DC=com`
    const suggested_entra_groups = [
      `${department}-All`,
      `${department}-${job_title}`,
      location !== 'Remote' ? `Location-${location}` : 'Remote-Access',
      worker_type === 'Employee' ? 'Employees' : worker_type,
    ]
    const suggested_m365_license = department === 'Finance' ? 'Microsoft 365 E3' : 'Microsoft 365 E5'

    // Create onboarding request
    const { data, error } = await supabase
      .from('onboarding_requests')
      .insert({
        employee_name,
        employee_email,
        department,
        job_title,
        location,
        worker_type,
        start_date,
        manager_name,
        manager_email,
        suggested_ad_ou,
        suggested_entra_groups,
        suggested_m365_license,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create request' }, { status: 500 })
    }

    // Log audit trail
    await supabase.from('audit_logs').insert({
      actor_name: 'System',
      actor_email: 'system@company.com',
      action: 'Onboarding Request Created',
      resource_type: 'request',
      resource_id: data.id,
      resource_name: `${employee_name} - ${job_title}`,
      status: 'success',
      details: `New onboarding request for ${employee_name} in ${department}`,
    })

    return NextResponse.json(
      {
        id: data.id,
        message: 'Request created successfully',
        status: 'pending',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('onboarding_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
    }

    return NextResponse.json({ requests: data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
