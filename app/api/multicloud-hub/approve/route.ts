import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const resendApiKey = process.env.RESEND_API_KEY

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { requestId, action, rejectionReason, managerEmail, managerName } = body

    if (!requestId || !action) {
      return NextResponse.json({ error: 'Missing requestId or action' }, { status: 400 })
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Fetch the current request
    const { data: currentRequest, error: fetchError } = await supabase
      .from('onboarding_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError || !currentRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Update request status
    const updateData =
      action === 'approve'
        ? {
            status: 'approved',
            approved_at: new Date().toISOString(),
            approved_by: null, // Could add user ID here later
          }
        : {
            status: 'rejected',
            rejection_reason: rejectionReason || 'No reason provided',
          }

    const { error: updateError } = await supabase
      .from('onboarding_requests')
      .update(updateData)
      .eq('id', requestId)

    if (updateError) {
      console.error('❌ Update error:', updateError)
      return NextResponse.json(
        { error: `Failed to update request: ${updateError.message}` },
        { status: 500 }
      )
    }

    // Log audit trail
    await supabase.from('audit_logs').insert({
      actor_name: managerName || 'Unknown',
      actor_email: managerEmail || 'unknown@company.com',
      action: action === 'approve' ? 'Request Approved' : 'Request Rejected',
      resource_type: 'request',
      resource_id: requestId,
      resource_name: `${currentRequest.employee_name} - ${currentRequest.job_title}`,
      status: 'success',
      details: action === 'approve' ? 'Request approved by manager' : `Request rejected: ${rejectionReason}`,
    })

    // Send confirmation email to manager
    if (resend && managerEmail) {
      try {
        await resend.emails.send({
          from: 'Onboarding <onboarding@resend.dev>',
          to: managerEmail,
          subject:
            action === 'approve'
              ? `Confirmed: ${currentRequest.employee_name} Approved`
              : `Confirmed: ${currentRequest.employee_name} Denied`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">${action === 'approve' ? '✅ Request Approved' : '❌ Request Denied'}</h2>
              <p>Hi ${managerName},</p>
              <p>
                You have successfully ${action === 'approve' ? 'approved' : 'denied'} the onboarding request for:
              </p>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>${currentRequest.employee_name}</strong></p>
                <p>${currentRequest.job_title} in ${currentRequest.department}</p>
              </div>
              ${action === 'approve'
                ? `<p>The request will now proceed to provisioning. The employee will be notified of their new account details.</p>`
                : `<p>The employee has been notified of the denial.</p>
                ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}`
              }
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px;">Multi-Cloud IAM Hub • Automated Onboarding System</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.warn('⚠️ Manager confirmation email failed:', emailError)
      }
    }

    // Send notification email to employee
    if (resend && currentRequest.employee_email) {
      try {
        await resend.emails.send({
          from: 'Onboarding <onboarding@resend.dev>',
          to: currentRequest.employee_email,
          subject:
            action === 'approve'
              ? `Great News! Your Onboarding Request is Approved`
              : `Update on Your Onboarding Request`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">${action === 'approve' ? '✅ Your Request Approved!' : 'Update on Your Request'}</h2>
              <p>Hi ${currentRequest.employee_name},</p>
              ${
                action === 'approve'
                  ? `
                <p>Congratulations! Your onboarding request for the ${currentRequest.job_title} position has been approved.</p>
                <p>Your manager has approved your request and it is now proceeding to provisioning.</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Your Details:</strong></p>
                  <p>Position: ${currentRequest.job_title}</p>
                  <p>Department: ${currentRequest.department}</p>
                  <p>Start Date: ${currentRequest.start_date ? new Date(currentRequest.start_date).toLocaleDateString() : 'Not specified'}</p>
                </div>
                <p>You will receive your account details shortly.</p>
              `
                  : `
                <p>Thank you for your onboarding request. Unfortunately, your request has been denied.</p>
                ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
                <p>Please contact your manager if you have any questions.</p>
              `
              }
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px;">Multi-Cloud IAM Hub • Automated Onboarding System</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.warn('⚠️ Employee notification email failed:', emailError)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        status: action === 'approve' ? 'approved' : 'rejected',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
