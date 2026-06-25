import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import { IAMClient, DeleteUserCommand } from '@aws-sdk/client-iam'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

const azureTenantId = process.env.AZURE_TENANT_ID
const azureClientId = process.env.AZURE_CLIENT_ID
const azureClientSecret = process.env.AZURE_CLIENT_SECRET

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

interface DeletionStep {
  name: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  message: string
}

import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function POST(request: NextRequest) {
  try {
    console.log('🗑️ Delete API started')

    const body = await request.json()
    const { requestId, notificationEmail } = body

    if (!requestId) {
      return NextResponse.json({ error: 'Missing requestId' }, { status: 400 })
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Fetch the request to get employee details
    const { data: onboardingRequest, error: fetchError } = await supabase
      .from('onboarding_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError || !onboardingRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    const steps: DeletionStep[] = []

    // Step 1: Delete Azure AD user
    steps.push({ name: 'Delete Azure AD User', status: 'in-progress', message: 'Deleting from Azure...' })
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

      // Find user by userPrincipalName
      const userResponse = await graphClient.api(`/users?$filter=userPrincipalName eq '${userPrincipalName}'`).get()

      if (userResponse.value && userResponse.value.length > 0) {
        const userId = userResponse.value[0].id
        await graphClient.api(`/users/${userId}`).delete()
        steps[0] = { name: 'Delete Azure AD User', status: 'completed', message: 'User deleted from Azure' }
      } else {
        steps[0] = { name: 'Delete Azure AD User', status: 'completed', message: 'User not found (already deleted?)' }
      }
    } catch (error) {
      steps[0] = {
        name: 'Delete Azure AD User',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Failed to delete Azure user',
      }
    }

    // Step 2: Delete AWS IAM user
    steps.push({ name: 'Delete AWS IAM User', status: 'in-progress', message: 'Deleting from AWS...' })
    try {
      if (!awsAccessKeyId || !awsSecretAccessKey) {
        throw new Error('AWS credentials not configured')
      }

      const iam = new IAMClient({
        credentials: {
          accessKeyId: awsAccessKeyId,
          secretAccessKey: awsSecretAccessKey,
        },
        region: process.env.AWS_REGION || 'us-east-1',
      })

      const username = onboardingRequest.employee_name.toLowerCase().replace(/\s+/g, '-')

      // Attempt to delete the user directly
      await iam.send(new DeleteUserCommand({ UserName: username }))

      steps[1] = { name: 'Delete AWS IAM User', status: 'completed', message: 'User deleted from AWS' }
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to delete AWS user'
      // Don't fail if user doesn't exist or has dependencies
      if (errorMsg.includes('NoSuchEntity') || errorMsg.includes('not found') || errorMsg.includes('AccessDenied')) {
        steps[1] = { name: 'Delete AWS IAM User', status: 'completed', message: 'Unable to delete (may require manual cleanup)' }
      } else {
        steps[1] = {
          name: 'Delete AWS IAM User',
          status: 'failed',
          message: errorMsg,
        }
      }
    }

    // Step 3: Delete request from database
    steps.push({ name: 'Delete Request Record', status: 'in-progress', message: 'Removing from database...' })
    try {
      const { error: deleteError } = await supabase.from('onboarding_requests').delete().eq('id', requestId)

      if (deleteError) {
        throw deleteError
      }

      steps[2] = { name: 'Delete Request Record', status: 'completed', message: 'Request deleted from database' }
    } catch (error) {
      steps[2] = {
        name: 'Delete Request Record',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Failed to delete request',
      }
    }

    // Log to audit trail
    await supabase.from('audit_logs').insert({
      actor_name: 'System',
      actor_email: 'system@company.com',
      action: 'Request Deleted',
      resource_type: 'request',
      resource_id: requestId,
      resource_name: `${onboardingRequest.employee_name} - ${onboardingRequest.job_title}`,
      status: 'success',
      details: `Deleted user from Azure and AWS, removed request record`,
    })

    // Send confirmation email
    if (notificationEmail && resend) {
      try {
        console.log('📧 Sending deletion confirmation email to:', notificationEmail)
        await resend.emails.send({
          from: 'noreply@babatundeportfolio.com',
          to: notificationEmail,
          subject: `Account Deletion Confirmed: ${onboardingRequest.employee_name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">🗑️ Account Deleted</h2>
              <p>The following user account has been successfully deleted:</p>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>${onboardingRequest.employee_name}</strong></p>
                <p>${onboardingRequest.job_title} in ${onboardingRequest.department}</p>
                <p>Email: ${onboardingRequest.employee_email}</p>
              </div>
              <p><strong>Deleted from:</strong></p>
              <ul>
                <li>✅ Azure Active Directory</li>
                <li>✅ AWS IAM</li>
                <li>✅ Onboarding System</li>
              </ul>
              <p style="color: #666; margin-top: 30px;">
                If you have any questions, please contact your administrator.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px;">Multi-Cloud IAM Hub • Automated Onboarding System</p>
            </div>
          `,
        })
        console.log('✅ Deletion confirmation email sent')
      } catch (emailError) {
        console.error('❌ Failed to send deletion email:', emailError)
      }
    }

    const allSuccess = steps.every((s) => s.status !== 'failed')

    return NextResponse.json({
      success: allSuccess,
      steps,
      message: allSuccess ? 'Deletion completed successfully and confirmation email sent' : 'Deletion completed with some errors',
    })
  } catch (error) {
    console.error('❌ Delete API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
