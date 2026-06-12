// In-memory store for audit logs (persists during deployment)
export const auditLogs: any[] = []

export function addAuditLog(log: any) {
  auditLogs.push(log)
}

export function getAuditLogs() {
  return auditLogs
}
