import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const resendApiKey = process.env.RESEND_API_KEY

const resend = resendApiKey ? new Resend(resendApiKey) : null

// Check if Supabase credentials are configured
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase credentials not configured. API will return mock responses.')
}

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

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

    // If Supabase is not configured, return mock response for now
    if (!supabase) {
      console.warn('⚠️ Supabase not configured. Returning mock response with generated ID.')
      const mockId = `req_${Date.now()}`
      return NextResponse.json(
        {
          id: mockId,
          message: 'Request created successfully (mock - configure Supabase to persist)',
          status: 'pending',
          note: 'Set SUPABASE_SERVICE_ROLE_KEY in environment variables to save to database',
        },
        { status: 201 }
      )
    }

    // Create onboarding request in Supabase
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
      console.error('❌ Supabase insert error:', error)
      return NextResponse.json(
        {
          error: `Failed to create request: ${error.message}`,
          details: error,
        },
        { status: 500 }
      )
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

    // Send approval request email to manager
    if (manager_email && resend) {
      const approvalUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://babatundeportfolio.com'}/multicloud-hub/approve?requestId=${data.id}`

      try {
        console.log('📧 Sending approval request email to:', manager_email)
        const emailResult = await resend.emails.send({
          from: 'noreply@babatundeportfolio.com',
          to: manager_email,
          subject: `Approval Requested: ${employee_name} - ${job_title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Approval Requested</h2>
              <p>Hi ${manager_name},</p>
              <p>A new onboarding request requires your approval:</p>

              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Employee:</strong> ${employee_name}</p>
                <p><strong>Position:</strong> ${job_title}</p>
                <p><strong>Department:</strong> ${department}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Start Date:</strong> ${start_date || 'Not specified'}</p>
              </div>

              <p>Please review and approve or deny this request:</p>

              <div style="margin: 30px 0;">
                <a href="${approvalUrl}" style="background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
                  Review Request
                </a>
              </div>

              <p style="color: #666; font-size: 12px;">
                If the button doesn't work, copy and paste this link:<br/>
                <code>${approvalUrl}</code>
              </p>

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px;">Multi-Cloud IAM Hub • Automated Onboarding System</p>
            </div>
          `,
        })
        console.log('✅ Email sent successfully:', emailResult)
      } catch (emailError) {
        console.error('❌ Email send failed:', emailError)
        // Don't fail the request if email fails, just log it
      }
    }

    return NextResponse.json(
      {
        id: data.id,
        message: 'Request created successfully',
        status: 'pending',
        emailSent: manager_email ? true : false,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured. Returning empty mock response.')
      return NextResponse.json({ requests: [] })
    }

    const { data, error } = await supabase
      .from('onboarding_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Supabase fetch error:', error)
      return NextResponse.json(
        { error: `Failed to fetch requests: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ requests: data as any[] || [] })
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
