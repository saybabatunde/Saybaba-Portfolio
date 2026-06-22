import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resendApiKey = process.env.RESEND_API_KEY

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing Resend API...')
    console.log('RESEND_API_KEY exists:', !!resendApiKey)
    console.log('RESEND_API_KEY length:', resendApiKey?.length)

    if (!resendApiKey) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY not configured', configured: false },
        { status: 500 }
      )
    }

    const resend = new Resend(resendApiKey)

    console.log('📧 Sending test email...')
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'olawalebabatunde98@gmail.com',
      subject: 'Test Email from Multi-Cloud Hub',
      html: '<h1>Hello!</h1><p>This is a test email from your Multi-Cloud IAM Hub to verify Resend is working.</p>',
    })

    console.log('✅ Email sent successfully:', result)

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      result,
    })
  } catch (error) {
    console.error('❌ Error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      },
      { status: 500 }
    )
  }
}
