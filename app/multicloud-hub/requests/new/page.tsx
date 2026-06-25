'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const DEPARTMENTS = ['Finance', 'Engineering', 'HR', 'Sales', 'Marketing', 'Operations', 'Legal']
const JOB_TITLES = [
  'Analyst',
  'Senior Analyst',
  'Manager',
  'Senior Manager',
  'Director',
  'Engineer',
  'Senior Engineer',
  'Lead Engineer',
  'Specialist',
  'Coordinator',
]
const LOCATIONS = ['Canada', 'USA', 'UK', 'Germany', 'Australia', 'India', 'Remote']
const WORKER_TYPES = ['Employee', 'Contractor', 'Vendor', 'Consultant']

interface FormData {
  employee_name: string
  employee_email: string
  department: string
  job_title: string
  location: string
  worker_type: string
  start_date: string
  manager_name: string
  manager_email: string
}

export default function NewOnboardingRequest() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [suggestedMapping, setSuggestedMapping] = useState<any>(null)

  const [formData, setFormData] = useState<FormData>({
    employee_name: '',
    employee_email: '',
    department: '',
    job_title: '',
    location: '',
    worker_type: 'Employee',
    start_date: '',
    manager_name: '',
    manager_email: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGetSuggestions = () => {
    // Mock role mapping suggestions
    const suggestions = {
      suggested_ad_ou: `OU=${formData.department},OU=Users,DC=company,DC=com`,
      suggested_entra_groups: [
        `${formData.department}-All`,
        `${formData.department}-${formData.job_title}`,
        formData.location !== 'Remote' ? `Location-${formData.location}` : 'Remote-Access',
        formData.worker_type === 'Employee' ? 'Employees' : formData.worker_type,
      ],
      suggested_m365_license:
        formData.department === 'Finance' ? 'Microsoft 365 E3' : 'Microsoft 365 E5',
      suggested_apps: getAppsForRole(formData.department),
    }
    setSuggestedMapping(suggestions)
  }

  const getAppsForRole = (dept: string): string[] => {
    const appsByDept: Record<string, string[]> = {
      Finance: ['SAP Finance', 'Power BI', 'SharePoint Finance', 'Azure Storage'],
      Engineering: ['GitHub', 'Azure DevOps', 'Visual Studio', 'AWS Console'],
      HR: ['Workday', 'Successfactors', 'SharePoint HR', 'Teams'],
      Sales: ['Salesforce', 'Tableau', 'Dynamics 365', 'Teams'],
      Marketing: ['HubSpot', 'Marketo', 'Adobe Suite', 'Google Analytics'],
      Operations: ['ServiceNow', 'Jira', 'Confluence', 'Azure Portal'],
      Legal: ['Contract Management', 'SharePoint Legal', 'eSignature', 'Compliance Vault'],
    }
    return appsByDept[dept] || []
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/multicloud-hub/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create request')
      }

      const data = await response.json()
      router.push(`/multicloud-hub/requests/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }} className="sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link
            href="/multicloud-hub"
            className="inline-flex items-center gap-2 mb-6 font-medium transition"
            style={{ color: '#6366F1' }}
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#111827' }}>New Onboarding Request</h1>
          <p style={{ color: '#6B7280' }}>Submit a user onboarding request for Entra ID, AD, and M365</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Demo Notice */}
        <div className="rounded-lg p-6 mb-12" style={{ backgroundColor: '#F0F9FF', borderLeft: '4px solid #6366F1' }}>
          <p style={{ color: '#1F2937' }}>
            💡 <strong>This is a demo.</strong> Use your own email to test the approval workflow. You'll receive an approval request email, and can approve or deny the request to see the complete workflow in action.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Employee Information */}
          <div className="rounded-lg border p-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
            <h2 className="text-2xl font-bold mb-8 pb-6 flex items-center gap-2" style={{ color: '#111827', borderBottom: '1px solid #E5E7EB' }}>
              👤 Employee Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Full Name */}
              <div>
                <label className="block font-semibold mb-3" style={{ color: '#111827' }}>Full Name *</label>
                <input
                  type="text"
                  name="employee_name"
                  value={formData.employee_name}
                  onChange={handleChange}
                  placeholder="e.g., Sarah Johnson"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition"
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderColor: '#E5E7EB',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#6366F1')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold mb-3" style={{ color: '#111827' }}>Email *</label>
                <input
                  type="email"
                  name="employee_email"
                  value={formData.employee_email}
                  onChange={handleChange}
                  placeholder="e.g., sarah@company.com"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition"
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderColor: '#E5E7EB',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#6366F1')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
                />
              </div>

              {/* Department */}
              <div>
                <label className="block font-semibold mb-3" style={{ color: '#111827' }}>Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 text-gray-900 focus:outline-none transition"
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderColor: '#E5E7EB',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#6366F1')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
                >
                  <option value="">-- Select Department --</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Title */}
              <div>
                <label className="block font-semibold mb-3" style={{ color: '#111827' }}>Job Title *</label>
                <select
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 text-gray-900 focus:outline-none transition"
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderColor: '#E5E7EB',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#6366F1')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
                >
                  <option value="">-- Select Job Title --</option>
                  {JOB_TITLES.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block font-semibold mb-3" style={{ color: '#111827' }}>Location *</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 text-gray-900 focus:outline-none transition"
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderColor: '#E5E7EB',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#6366F1')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
                >
                  <option value="">-- Select Location --</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Worker Type */}
              <div>
                <label className="block font-semibold mb-3" style={{ color: '#111827' }}>Worker Type *</label>
                <select
                  name="worker_type"
                  value={formData.worker_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 text-gray-900 focus:outline-none transition"
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderColor: '#E5E7EB',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#6366F1')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
                >
                  {WORKER_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block font-semibold mb-3" style={{ color: '#111827' }}>Start Date *</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 text-gray-900 focus:outline-none transition"
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderColor: '#E5E7EB',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#6366F1')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
                />
              </div>
            </div>
          </div>

          {/* Manager Information */}
          <div className="rounded-lg border p-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
            <h2 className="text-2xl font-bold mb-8 pb-6 flex items-center gap-2" style={{ color: '#111827', borderBottom: '1px solid #E5E7EB' }}>
              👔 Manager Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Manager Name */}
              <div>
                <label className="block font-semibold mb-3" style={{ color: '#111827' }}>Manager Name *</label>
                <input
                  type="text"
                  name="manager_name"
                  value={formData.manager_name}
                  onChange={handleChange}
                  placeholder="e.g., John Smith"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition"
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderColor: '#E5E7EB',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#6366F1')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
                />
              </div>

              {/* Manager Email */}
              <div>
                <label className="block font-semibold mb-3" style={{ color: '#111827' }}>Manager Email *</label>
                <input
                  type="email"
                  name="manager_email"
                  value={formData.manager_email}
                  onChange={handleChange}
                  placeholder="e.g., john@company.com"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition"
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderColor: '#E5E7EB',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#6366F1')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
                />
              </div>
            </div>
          </div>

          {/* Get Suggestions */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={handleGetSuggestions}
              disabled={!formData.department || !formData.job_title}
              className="font-semibold py-3 px-8 rounded-lg transition"
              style={{
                backgroundColor: !formData.department || !formData.job_title ? '#D1D5DB' : '#6366F1',
                color: '#FFFFFF',
                cursor: !formData.department || !formData.job_title ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!(!formData.department || !formData.job_title)) {
                  e.currentTarget.style.backgroundColor = '#4F46E5'
                }
              }}
              onMouseLeave={(e) => {
                if (!(!formData.department || !formData.job_title)) {
                  e.currentTarget.style.backgroundColor = '#6366F1'
                }
              }}
            >
              ✨ Get Role Mapping Suggestions
            </button>
          </div>

          {/* Suggested Mapping */}
          {suggestedMapping && (
            <div className="rounded-lg border p-8" style={{ backgroundColor: '#F0F9FF', borderColor: '#BFDBFE' }}>
              <h2 className="text-2xl font-bold mb-8 pb-6 flex items-center gap-2" style={{ color: '#111827', borderBottom: '1px solid #E5E7EB' }}>
                🎯 Suggested Provisioning
              </h2>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>Suggested AD OU</p>
                  <p className="text-sm font-mono p-3 rounded-lg" style={{ backgroundColor: '#E0E7FF', color: '#4F46E5' }}>
                    {suggestedMapping.suggested_ad_ou}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: '#6B7280' }}>Entra Groups</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedMapping.suggested_entra_groups.map((group: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: '#DDD6FE', color: '#4F46E5' }}
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6B7280' }}>M365 License</p>
                  <p style={{ color: '#1F2937' }}>{suggestedMapping.suggested_m365_license}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: '#6B7280' }}>Suggested Applications</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedMapping.suggested_apps.map((app: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: '#DCFCE7', color: '#166534' }}
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border-l-4 p-6" style={{ backgroundColor: '#FEF2F2', borderColor: '#EF4444', color: '#7F1D1D' }}>
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 font-semibold py-4 px-6 rounded-lg transition text-white"
              style={{
                backgroundColor: loading ? '#D1D5DB' : '#10B981',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#059669'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#10B981'
              }}
            >
              {loading ? 'Submitting...' : '✅ Submit Request for Approval'}
            </button>
            <Link
              href="/multicloud-hub"
              className="flex-1 font-semibold py-4 px-6 rounded-lg text-center transition"
              style={{
                backgroundColor: '#E5E7EB',
                color: '#1F2937',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D1D5DB')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E5E7EB')}
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
