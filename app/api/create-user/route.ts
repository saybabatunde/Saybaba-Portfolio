import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { addAuditLog } from '../store'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, group } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email required' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      )
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

    // Send welcome email
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
      console.error('Failed to send email:', emailError)
      // Don't fail the user creation if email fails
    }

    return NextResponse.json(auditLog, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
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
