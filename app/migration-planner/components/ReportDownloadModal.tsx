'use client'

import { useState } from 'react'

interface ReportData {
  vms: any[]
  assessments: any[]
  totalCurrentCost: number
  totalAzureCost: number
  totalSavings: number
  timeline: string
}

interface ReportDownloadModalProps {
  data: ReportData
  onClose: () => void
}

export default function ReportDownloadModal({ data, onClose }: ReportDownloadModalProps) {
  const [email, setEmail] = useState('')
  const [format, setFormat] = useState<'pdf' | 'docx' | 'csv'>('pdf')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      console.log('Sending report to:', email)

      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch('/api/send-migration-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          format: format,
          migrationData: data
        }),
        signal: controller.signal
      })

      clearTimeout(timeout)

      console.log('Response status:', response.status)

      let result: any
      try {
        result = await response.json()
      } catch (jsonError) {
        console.error('Failed to parse JSON:', jsonError)
        setMessage('Error: Invalid response from server')
        setLoading(false)
        return
      }

      console.log('API Response:', { status: response.status, result })

      if (response.ok && result.success) {
        setEmailSent(true)
        setMessage(`✓ Report sent to ${email}`)
        setTimeout(() => onClose(), 3000)
      } else {
        const errorMsg = result?.error || result?.details || JSON.stringify(result) || 'Failed to send report. Please try again.'
        console.error('API Error Details:', { status: response.status, error: errorMsg, fullResponse: result })
        setMessage(`Error: ${errorMsg}`)
        setLoading(false)
      }
    } catch (error) {
      console.error('Network Error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Network error. Please check your connection and try again.'
      setMessage(`Error: ${errorMsg}`)
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-8 py-6"
          style={{ backgroundColor: '#2563EB' }}
        >
          <h2 className="text-2xl font-bold text-white">
            Download Migration Report
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Get your detailed analysis delivered to your inbox
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {emailSent ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">✅</div>
              <p
                className="text-lg font-bold"
                style={{ color: '#10B981' }}
              >
                Report Sent!
              </p>
              <p style={{ color: '#6B7280' }} className="text-sm">
                Check your email at <span className="font-semibold">{email}</span> for your detailed migration report.
              </p>
              <p style={{ color: '#9CA3AF' }} className="text-xs">
                Redirecting in 3 seconds...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold mb-2"
                  style={{ color: '#111827' }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition"
                  style={{
                    borderColor: email ? '#2563EB' : '#D1D5DB',
                    color: '#111827'
                  }}
                  disabled={loading}
                />
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                  Report will be sent to this email address
                </p>
              </div>

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-bold mb-3" style={{ color: '#111827' }}>
                  Report Format
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'pdf' as const, label: '📄 PDF (Recommended)', desc: 'Professional, easy to share' },
                    { value: 'docx' as const, label: '📝 Word Document', desc: 'Editable format' },
                    { value: 'csv' as const, label: '📊 CSV (Data Only)', desc: 'For spreadsheet analysis' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition"
                      style={{
                        borderColor: format === option.value ? '#2563EB' : '#E5E7EB',
                        backgroundColor: format === option.value ? '#F0F9FF' : '#FFFFFF'
                      }}
                    >
                      <input
                        type="radio"
                        name="format"
                        value={option.value}
                        checked={format === option.value}
                        onChange={(e) => setFormat(e.target.value as 'pdf' | 'docx' | 'csv')}
                        className="mr-3"
                        disabled={loading}
                      />
                      <div>
                        <p className="font-semibold" style={{ color: '#111827' }}>
                          {option.label}
                        </p>
                        <p className="text-xs" style={{ color: '#6B7280' }}>
                          {option.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              {message && (
                <div
                  className="p-3 rounded-lg text-sm font-semibold"
                  style={{
                    backgroundColor: message.includes('Error') ? '#FEE2E2' : '#DCFCE7',
                    color: message.includes('Error') ? '#991B1B' : '#166534'
                  }}
                >
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full font-bold py-3 rounded-lg transition text-white"
                style={{
                  backgroundColor: loading || !email ? '#D1D5DB' : '#2563EB',
                  opacity: loading || !email ? 0.7 : 1,
                  cursor: loading || !email ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '📤 Sending...' : '📥 Send Report to Email'}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full font-semibold py-2 rounded-lg transition"
                style={{
                  backgroundColor: '#F3F4F6',
                  color: '#6B7280'
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        {/* Footer Info */}
        <div
          className="px-8 py-4 text-xs text-center"
          style={{ backgroundColor: '#F9FAFB', borderTop: '1px solid #E5E7EB', color: '#6B7280' }}
        >
          <p>
            Your migration data is processed securely and sent via Resend.
          </p>
        </div>
      </div>
    </div>
  )
}
