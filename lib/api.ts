import type { CreateUserRequest, AuditLog } from './types'

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3001/api'

export async function createUser(data: CreateUserRequest): Promise<AuditLog> {
  const response = await fetch(`${API_ENDPOINT}/create-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create user')
  }

  return response.json()
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const response = await fetch(`${API_ENDPOINT}/audit-logs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch audit logs')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.logs || []
}
