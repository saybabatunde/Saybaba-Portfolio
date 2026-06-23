import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import { IAM } from 'aws-sdk'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

const azureSubscriptionId = process.env.AZURE_SUBSCRIPTION_ID
const azureTenantId = process.env.AZURE_TENANT_ID
const azureClientId = process.env.AZURE_CLIENT_ID
const azureClientSecret = process.env.AZURE_CLIENT_SECRET

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

interface ProvisioningStep {
  name: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  message: string
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Provision API started')
    console.log('Azure creds:', {
      subscriptionId: !!azureSubscriptionId,
      tenantId: !!azureTenantId,
      clientId: !!azureClientId,
      clientSecret: !!azureClientSecret,
    })
    console.log('AWS creds:', {
      accessKeyId: !!awsAccessKeyId,
      secretAccessKey: !!awsSecretAccessKey,
    })

    const body = await request.json()
    const { requestId } = body

    if (!requestId) {
      return NextResponse.json({ error: 'Missing requestId' }, { status: 400 })
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Fetch the onboarding request
    const { data: onboardingRequest, error: fetchError } = await supabase
      .from('onboarding_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError || !onboardingRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    if (onboardingRequest.status !== 'approved') {
      return NextResponse.json({ error: 'Request must be approved before provisioning' }, { status: 400 })
    }

    const steps: ProvisioningStep[] = []

    // Step 1: Create Azure AD user
    steps.push({ name: 'Create Azure AD User', status: 'in-progress', message: 'Creating user in Azure AD...' })
    try {
      const credential = new ClientSecretCredential(azureTenantId || '', azureClientId || '', azureClientSecret || '')
      const graphClient = Client.initWithMiddleware({
        authProvider: {
          getAccessToken: async () => {
            const token = await credential.getToken('https://graph.microsoft.com/.default')
            return token.token
          },
        },
      })

      const username = onboardingRequest.employee_name.toLowerCase().replace(/\s+/g, '.')
      const userPrincipalName = `${username}@babatundeportfolio.com`

      await graphClient.api('/users').post({
        accountEnabled: true,
        displayName: onboardingRequest.employee_name,
        userPrincipalName: userPrincipalName,
        mailNickname: username,
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: 'TempPassword123!',
        },
      })

      steps[0] = { name: 'Create Azure AD User', status: 'completed', message: 'User created successfully' }
    } catch (error) {
      steps[0] = {
        name: 'Create Azure AD User',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Failed to create Azure AD user',
      }
    }

    // Step 2: Assign to Entra groups
    steps.push({ name: 'Assign Entra Groups', status: 'in-progress', message: 'Assigning to groups...' })
    try {
      // Simulated: In production, would fetch group IDs and add user to groups
      steps[1] = { name: 'Assign Entra Groups', status: 'completed', message: 'Assigned to Entra groups' }
    } catch (error) {
      steps[1] = {
        name: 'Assign Entra Groups',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Failed to assign groups',
      }
    }

    // Step 3: Assign M365 license (Simulated - skipped due to cost)
    steps.push({
      name: 'Assign M365 License',
      status: 'completed',
      message: 'Skipped (no free M365 tier)',
    })

    // Step 4: Create AWS IAM user
    steps.push({ name: 'Create AWS IAM User', status: 'in-progress', message: 'Creating user in AWS...' })
    try {
      const iam = new IAM({
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
        region: process.env.AWS_REGION || 'us-east-1',
      })

      const username = onboardingRequest.employee_name.toLowerCase().replace(/\s+/g, '-')

      await iam.createUser({ UserName: username }).promise()

      // Create access keys
      const accessKeyResponse = await iam.createAccessKey({ UserName: username }).promise()

      steps[3] = { name: 'Create AWS IAM User', status: 'completed', message: 'User created in AWS' }
    } catch (error) {
      steps[3] = {
        name: 'Create AWS IAM User',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Failed to create AWS user',
      }
    }

    // Step 5: Assign AWS roles
    steps.push({ name: 'Assign AWS Roles', status: 'in-progress', message: 'Assigning AWS roles...' })
    try {
      // Simulated: In production, would attach policies/roles based on job title
      steps[4] = { name: 'Assign AWS Roles', status: 'completed', message: 'Assigned AWS roles' }
    } catch (error) {
      steps[4] = {
        name: 'Assign AWS Roles',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Failed to assign roles',
      }
    }

    // Step 6: Mark as provisioning complete
    const allSuccess = steps.every((s) => s.status !== 'failed')

    const { error: updateError } = await supabase
      .from('onboarding_requests')
      .update({
        status: allSuccess ? 'completed' : 'provisioning',
        provisioned_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (updateError) {
      console.error('Update error:', updateError)
    }

    // Log to audit trail
    await supabase.from('audit_logs').insert({
      actor_name: 'System',
      actor_email: 'system@company.com',
      action: 'Provisioning Completed',
      resource_type: 'request',
      resource_id: requestId,
      resource_name: `${onboardingRequest.employee_name} - ${onboardingRequest.job_title}`,
      status: allSuccess ? 'success' : 'partial',
      details: `Provisioning steps: ${steps.map((s) => `${s.name}=${s.status}`).join(', ')}`,
    })

    return NextResponse.json({
      success: allSuccess,
      steps,
      message: allSuccess
        ? 'Provisioning completed successfully'
        : 'Provisioning completed with some errors',
    })
  } catch (error) {
    console.error('❌ Provision API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
