import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const resendKey = process.env.RESEND_API_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const resend = new Resend(resendKey)

interface DeploymentResult {
  success: boolean
  resourceId: string
  resourceName: string
  endpoint?: string
}

// Mock Terraform deployment - in production, this would call real Terraform
async function deployWithTerraform(request: any): Promise<DeploymentResult> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate mock resource ID and names
  const timestamp = Date.now()
  const vmName = `vm-${request.vm_size.toLowerCase()}-${timestamp}`
  const resourceGroupName = `rg-${request.compliance_level}-${timestamp}`

  // In production, this would:
  // 1. Write terraform variables file
  // 2. Run `terraform init`
  // 3. Run `terraform plan`
  // 4. Run `terraform apply`
  // 5. Parse outputs for resource IDs and endpoints

  return {
    success: true,
    resourceId: `/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/${resourceGroupName}/providers/Microsoft.Compute/virtualMachines/${vmName}`,
    resourceName: vmName,
    endpoint: `https://${vmName}.${request.region}.cloudapp.azure.com`,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { requestId } = await request.json()

    if (!requestId) {
      return NextResponse.json(
        { error: 'Missing requestId' },
        { status: 400 }
      )
    }

    // Fetch request from database
    const { data: req, error: fetchError } = await supabase
      .from('infrastructure_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError || !req) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      )
    }

    // Check if already deployed
    if (req.status !== 'pending') {
      return NextResponse.json(
        { error: `Request is already ${req.status}` },
        { status: 400 }
      )
    }

    // Update status to deploying
    await supabase
      .from('infrastructure_requests')
      .update({ status: 'deploying' })
      .eq('id', requestId)

    // Call Terraform to provision resources
    let deployment: DeploymentResult
    try {
      deployment = await deployWithTerraform(req)
    } catch (deployError) {
      // Update status to failed
      await supabase
        .from('infrastructure_requests')
        .update({
          status: 'failed',
          error_message: deployError instanceof Error ? deployError.message : 'Deployment failed',
        })
        .eq('id', requestId)

      // Log audit trail
      await supabase.from('infrastructure_audit_logs').insert({
        request_id: requestId,
        user_email: req.user_email,
        action: 'failed',
        details: { error: deployError instanceof Error ? deployError.message : 'Deployment failed' },
      })

      return NextResponse.json(
        { error: 'Deployment failed. Please try again.' },
        { status: 500 }
      )
    }

    // Store deployed resource in database
    const { data: resource, error: resourceError } = await supabase
      .from('deployed_resources')
      .insert({
        request_id: requestId,
        azure_resource_id: deployment.resourceId,
        resource_type: 'vm',
        resource_name: deployment.resourceName,
        size: req.vm_size,
        region: req.region,
        monthly_cost: req.cost_estimate,
        estimated_monthly_cost: req.cost_estimate,
        status: 'active',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      })
      .select()
      .single()

    if (resourceError) {
      console.error('Error storing resource:', resourceError)
    }

    // Update request status to deployed
    await supabase
      .from('infrastructure_requests')
      .update({
        status: 'deployed',
        deployed_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    // Log audit trail
    await supabase.from('infrastructure_audit_logs').insert({
      request_id: requestId,
      user_email: req.user_email,
      action: 'deployed',
      details: {
        vmName: deployment.resourceName,
        resourceId: deployment.resourceId,
        endpoint: deployment.endpoint,
      },
    })

    // Send confirmation email
    try {
      await resend.emails.send({
        from: 'Infrastructure Portal <onboarding@resend.dev>',
        to: req.user_email,
        subject: `✅ Your Infrastructure is Ready - ${deployment.resourceName}`,
        html: `
          <h2>Infrastructure Deployment Successful</h2>
          <p>Your Azure infrastructure has been provisioned and is ready to use.</p>

          <h3>Resource Details</h3>
          <ul>
            <li><strong>VM Name:</strong> ${deployment.resourceName}</li>
            <li><strong>Size:</strong> ${req.vm_size}</li>
            <li><strong>Region:</strong> ${req.region}</li>
            <li><strong>Compliance Level:</strong> ${req.compliance_level}</li>
            <li><strong>Monthly Cost:</strong> $${req.cost_estimate.toFixed(2)}</li>
          </ul>

          <h3>Endpoint</h3>
          <p><code>${deployment.endpoint}</code></p>

          <h3>Next Steps</h3>
          <ol>
            <li>Log into your Azure Portal</li>
            <li>Configure your VM and install applications</li>
            <li>Monitor costs in the Infrastructure Portal dashboard</li>
            <li>Delete resources when no longer needed</li>
          </ol>

          <p>Resources auto-expire after 30 days. You'll receive a reminder at day 25.</p>

          <a href="${process.env.NEXT_PUBLIC_API_ENDPOINT}/infrastructure-portal/dashboard" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Dashboard</a>
        `,
      })
    } catch (emailError) {
      console.error('Email send error:', emailError)
      // Don't fail the deployment if email fails
    }

    return NextResponse.json({
      message: 'Infrastructure deployed successfully',
      resourceId: resource?.id,
      resourceName: deployment.resourceName,
      endpoint: deployment.endpoint,
    })
  } catch (error) {
    console.error('Approval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
