import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      )
    }

    // Create test request
    const { data: req, error: reqError } = await supabase
      .from('infrastructure_requests')
      .insert({
        user_email: email,
        vm_size: 'B1s',
        region: 'eastus',
        compliance_level: 'standard',
        cost_estimate: 0,
        status: 'deployed',
        deployed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (reqError) {
      return NextResponse.json(
        { error: 'Failed to create test request' },
        { status: 500 }
      )
    }

    // Create test deployed resource
    const { data: resource, error: resourceError } = await supabase
      .from('deployed_resources')
      .insert({
        request_id: req.id,
        azure_resource_id: `/subscriptions/test-123/resourceGroups/rg-test/providers/Microsoft.Compute/virtualMachines/vm-B1s-test`,
        resource_type: 'vm',
        resource_name: 'vm-B1s-test-demo',
        size: 'B1s',
        region: 'eastus',
        monthly_cost: 0,
        estimated_monthly_cost: 0,
        status: 'active',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .select()
      .single()

    if (resourceError) {
      return NextResponse.json(
        { error: 'Failed to create test resource' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Test resource created',
      requestId: req.id,
      resourceId: resource.id,
      resourceName: resource.resource_name,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
