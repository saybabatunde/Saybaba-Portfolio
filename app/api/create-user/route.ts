import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { addAuditLog } from '../store'

const resend = new Resend(process.env.RESEND_API_KEY)

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

async function logError(errorType: string, errorMessage: string, userName: string, userEmail: string, stackTrace: string) {
  try {
    const supabase = getSupabaseClient()
    await supabase.from('error_logs').insert([
      {
        error_type: errorType,
        error_message: errorMessage,
        user_name: userName,
        user_email: userEmail,
        stack_trace: stackTrace,
        status: 'open'
      }
    ])
  } catch (err) {
    console.error('Failed to log error to Supabase:', err)
  }
}

async function sendAdminNotification(errorType: string, errorMessage: string, userName: string, userEmail: string) {
  try {
    await resend.emails.send({
      from: 'alerts@babatundeportfolio.com',
      to: process.env.ADMIN_EMAIL || 'olawalebabatunde98@gmail.com',
      subject: `⚠️ ONBOARDING ERROR - ${errorType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">⚠️ Onboarding Error Alert</h2>

          <div style="background-color: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #d32f2f;">
            <p><strong>Error Type:</strong> ${errorType}</p>
            <p><strong>Error Message:</strong> ${errorMessage}</p>
          </div>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="margin-top: 0;">User Information:</h3>
            <p><strong>Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            <strong>Action Required:</strong> Please investigate and resolve this issue immediately.
          </p>
          <p style="color: #666; font-size: 14px;">
            Check your error logs dashboard for more details.
          </p>
          <p style="color: #999; font-size: 12px;">
            © 2024 Saybaba Portfolio. All rights reserved.
          </p>
        </div>
      `
    })
  } catch (err) {
    console.error('Failed to send admin notification:', err)
  }
}

export async function POST(request: NextRequest) {
  let userName = 'Unknown'
  let userEmail = 'unknown@example.com'

  try {
    const body = await request.json()
    const { name, email, group } = body

    userName = name || 'Unknown'
    userEmail = email || 'unknown@example.com'

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email required' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      )
    }

    // Check for duplicate email
    const supabase = getSupabaseClient()
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      throw new Error(`Email "${email}" is already registered. Please use a different email.`)
    }

    const username = email.split('@')[0]
    const auditId = crypto.randomUUID()
    const timestamp = new Date().toISOString()

    const auditLog = {
      auditId,
      timestamp,
      action: 'UserCreation',
      username,
      email,
      fullName: name,
      group: group || 'developers',
      status: 'COMPLETED',
      logs: [
        {
          timestamp: new Date().toISOString(),
          action: 'CreateUser',
          status: 'SUCCESS',
          details: `Created user: ${username}`
        }
      ]
    }

    addAuditLog(auditLog)

    // Insert user into database
    await supabase.from('users').insert([
      {
        email,
        name,
        username,
        group: group || 'developers'
      }
    ])

    // Send welcome email
    let emailSent = true
    try {
      await resend.emails.send({
        from: 'onboarding@babatundeportfolio.com',
        to: email,
        subject: 'Welcome to Saybaba Portfolio - User Onboarding Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to Saybaba Portfolio! 🎉</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your user account has been successfully created in the onboarding portal.</p>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Account Details:</h3>
              <p><strong>Username:</strong> ${username}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Group:</strong> ${group}</p>
              <p><strong>Audit ID:</strong> ${auditId}</p>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              This is an automated notification from the Saybaba Portfolio onboarding system.
            </p>
            <p style="color: #999; font-size: 12px;">
              © 2024 Saybaba Portfolio. All rights reserved.
            </p>
          </div>
        `
      })
    } catch (emailError) {
      emailSent = false
      const errorMsg = emailError instanceof Error ? emailError.message : 'Unknown email error'
      console.error('Failed to send email:', emailError)

      // Log error and notify admin
      await logError('EMAIL_SEND_FAILURE', errorMsg, name, email, JSON.stringify(emailError))
      await sendAdminNotification('EMAIL_SEND_FAILURE', errorMsg, name, email)
    }

    return NextResponse.json({ ...auditLog, emailSent }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? (error.stack || 'No stack trace available') : 'No stack trace available'

    console.error('Error creating user:', error)

    // Log error and notify admin (userName and userEmail already captured at top of function)
    await logError('USER_CREATION_FAILURE', errorMsg, userName, userEmail, errorStack)
    await sendAdminNotification('USER_CREATION_FAILURE', errorMsg, userName, userEmail)

    return NextResponse.json(
      {
        error: 'Something went wrong with your submission',
        message: 'Admin has been notified and will investigate immediately. Please check back in 5 minutes.',
        errorId: crypto.randomUUID()
      },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
