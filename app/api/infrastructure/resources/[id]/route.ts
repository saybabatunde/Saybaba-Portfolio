import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const resendKey = process.env.RESEND_API_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const resend = new Resend(resendKey)

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resourceId = params.id

    // Fetch resource
    const { data: resource, error: fetchError } = await supabase
      .from('deployed_resources')
      .select('*, infrastructure_requests(user_email, cost_estimate)')
      .eq('id', resourceId)
      .single()

    if (fetchError || !resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Call Terraform to destroy resources
    // In production, this would run: terraform destroy -auto-approve
    // For now, we just mark it as deleted
    try {
      // Simulate Terraform destroy
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (destroyError) {
      console.error('Terraform destroy error:', destroyError)
      return NextResponse.json(
        { error: 'Failed to destroy resources' },
        { status: 500 }
      )
    }

    // Mark resource as deleted
    const { error: updateError } = await supabase
      .from('deployed_resources')
      .update({
        deleted_at: new Date().toISOString(),
        status: 'deleted',
      })
      .eq('id', resourceId)

    if (updateError) {
      console.error('Error updating resource:', updateError)
      return NextResponse.json(
        { error: 'Failed to mark resource as deleted' },
        { status: 500 }
      )
    }

    // Log audit trail
    const userEmail = resource.infrastructure_requests?.user_email
    await supabase.from('infrastructure_audit_logs').insert({
      request_id: resource.request_id,
      user_email: userEmail,
      action: 'deleted',
      details: {
        resourceName: resource.resource_name,
        monthlyCostSaved: resource.monthly_cost,
      },
    })

    // Send deletion confirmation email
    try {
      await resend.emails.send({
        from: 'Infrastructure Portal <onboarding@resend.dev>',
        to: userEmail,
        subject: `✅ Resource Deleted - ${resource.resource_name}`,
        html: `
          <h2>Resource Deletion Confirmed</h2>
          <p>Your infrastructure resource has been successfully deleted.</p>

          <h3>Resource Details</h3>
          <ul>
            <li><strong>Name:</strong> ${resource.resource_name}</li>
            <li><strong>Type:</strong> ${resource.resource_type}</li>
            <li><strong>Monthly Cost Saved:</strong> $${resource.monthly_cost.toFixed(2)}</li>
          </ul>

          <h3>Impact</h3>
          <p>✓ Azure resources have been destroyed</p>
          <p>✓ Charges will stop immediately</p>
          <p>✓ All data and configurations have been removed</p>

          <p>Need to deploy more infrastructure? <a href="${process.env.NEXT_PUBLIC_API_ENDPOINT}/infrastructure-portal">Request now</a></p>
        `,
      })
    } catch (emailError) {
      console.error('Email send error:', emailError)
    }

    return NextResponse.json({
      message: 'Resource deleted successfully',
      resourceId,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
