export interface CreateUserRequest {
  name: string
  email: string
  group: string
}

export interface ActionLog {
  timestamp: string
  action: string
  status: 'SUCCESS' | 'FAILED'
  details: string
}

export interface AuditLog {
  auditId: string
  timestamp: string
  action: string
  username: string
  email: string
  fullName: string
  group: string
  status: string
  logs?: ActionLog[]
}
