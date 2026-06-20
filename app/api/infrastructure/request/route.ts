import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { vmSize, region, complianceLevel, email, costEstimate } = await request.json()

    // Validate input
    if (!vmSize || !region || !complianceLevel || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate VM size (cost control)
    const allowedVMs = ['B1s', 'B2s', 'B4ms']
    if (!allowedVMs.includes(vmSize)) {
      return NextResponse.json(
        { error: 'Invalid VM size. Allowed: B1s, B2s, B4ms' },
        { status: 400 }
      )
    }

    // Create request in database
    const { data, error } = await supabase
      .from('infrastructure_requests')
      .insert({
        user_email: email,
        vm_size: vmSize,
        region,
        compliance_level: complianceLevel,
        cost_estimate: costEstimate,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create request' },
        { status: 500 }
      )
    }

    // Log audit trail
    await supabase
      .from('infrastructure_audit_logs')
      .insert({
        request_id: data.id,
        user_email: email,
        action: 'submitted',
        details: { vmSize, region, complianceLevel, costEstimate },
      })

    return NextResponse.json({
      requestId: data.id,
      message: 'Request submitted for approval',
    })
  } catch (error) {
    console.error('Request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
