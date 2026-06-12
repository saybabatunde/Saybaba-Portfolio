import { NextRequest, NextResponse } from 'next/server'
import { addAuditLog } from '../store'

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
