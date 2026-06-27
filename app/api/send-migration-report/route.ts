import { NextRequest, NextResponse } from 'next/server'
import FormData from 'form-data'
import Mailgun from 'mailgun.js'

const mailgun = new Mailgun(FormData)
const client = mailgun.client({ key: process.env.MAILGUN_API_KEY || '' })

interface MigrationData {
  vms: any[]
  assessments: any[]
  totalCurrentCost: number
  totalAzureCost: number
  totalSavings: number
  timeline: string
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
      console.error('Mailgun credentials not configured')
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      )
    }

    const { email, format, migrationData } = await request.json()

    console.log('Report request:', { email, format, vmCount: migrationData?.vms?.length })

    if (!email || !format || !migrationData) {
      return NextResponse.json(
        { error: 'Email, format, and migration data are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    console.log('Sending report to:', email)

    const mg = client.domains.domain(process.env.MAILGUN_DOMAIN || '')

    const emailResponse = await mg.messages.create(process.env.MAILGUN_DOMAIN || '', {
      from: `Migration Planner <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: email,
      subject: 'Your VMware to Azure Migration Analysis Report',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; color: #374151;">
          <div style="background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%); color: white; padding: 40px 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">VMware to Azure Migration Planner</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Analysis Report</p>
          </div>

          <div style="padding: 40px 20px; background: white; border: 1px solid #E5E7EB;">
            <p style="font-size: 16px; margin-top: 0;">Hi,</p>

            <p>Your migration analysis report is ready! Here's a quick summary of your infrastructure assessment:</p>

            <div style="background: #F0F9FF; border-left: 4px solid #2563EB; padding: 20px; border-radius: 4px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1E40AF;">Migration Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #BFDBFE;">
                    <strong>Total VMs Analyzed:</strong>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #BFDBFE; text-align: right;">
                    ${migrationData.vms.length}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #BFDBFE;">
                    <strong>Current Annual Cost:</strong>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #BFDBFE; text-align: right;">
                    $${migrationData.totalCurrentCost.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #BFDBFE;">
                    <strong>Proposed Azure Cost:</strong>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #BFDBFE; text-align: right;">
                    $${migrationData.totalAzureCost.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #10B981;">Annual Savings:</strong>
                  </td>
                  <td style="padding: 8px 0; text-align: right; font-size: 20px; font-weight: bold; color: #10B981;">
                    $${migrationData.totalSavings.toLocaleString()}
                  </td>
                </tr>
              </table>
              <p style="margin: 15px 0 0 0; font-size: 14px; color: #059669;">
                <strong>${((migrationData.totalSavings / migrationData.totalCurrentCost) * 100).toFixed(0)}% reduction in annual infrastructure costs</strong>
              </p>
            </div>

            <h3 style="color: #111827; margin-top: 30px;">What's in Your Report?</h3>
            <ul style="color: #374151;">
              <li>Executive Summary with key metrics</li>
              <li>Detailed VM Sizing Recommendations</li>
              <li>Cost Analysis & ROI Calculation</li>
              <li>${migrationData.timeline}-Week Phased Migration Plan</li>
              <li>Risk Assessment by VM</li>
              <li>Pre-Migration Checklist</li>
              <li>Network Architecture Recommendations</li>
              <li>Post-Migration Success Metrics</li>
            </ul>

            <div style="background: #DCFCE7; border-left: 4px solid #10B981; padding: 20px; border-radius: 4px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #166534;">✅ Next Steps</h4>
              <ol style="margin: 0; color: #166534;">
                <li>Review the report and summary</li>
                <li>Share with your IT leadership team</li>
                <li>Schedule migration planning sessions</li>
                <li>Set up Azure subscriptions and networking</li>
                <li>Execute phased migration plan</li>
              </ol>
            </div>

            <p style="margin-top: 30px; color: #6B7280; font-size: 14px;">
              Need more details? Visit the Migration Planner tool to refine your analysis or create additional scenarios.
            </p>

            <p style="margin: 20px 0 0 0; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px;">
              <strong>VMware to Azure Migration Planner</strong><br/>
              Built with cloud infrastructure expertise and powered by AI analysis.
            </p>
          </div>

          <div style="background: #F9FAFB; padding: 20px; text-align: center; font-size: 12px; color: #9CA3AF; border-radius: 0 0 8px 8px; border: 1px solid #E5E7EB; border-top: none;">
            <p style="margin: 0;">This report was generated securely and sent via Mailgun. Your infrastructure data is not stored on our servers.</p>
          </div>
        </div>
      `
    })

    console.log('Mailgun response:', { success: true, messageId: emailResponse.id })

    return NextResponse.json({
      success: true,
      message: `Report sent successfully to ${email}`,
      format: format
    })

  } catch (error) {
    console.error('API Error:', error)
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        error: 'Failed to send report',
        details: errorMsg
      },
      { status: 500 }
    )
  }
}
