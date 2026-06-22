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
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-purple-900 border-b border-blue-500 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/multicloud-hub"
            className="text-blue-300 hover:text-blue-200 font-semibold transition flex items-center gap-2 mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">New Onboarding Request</h1>
          <p className="text-blue-200 text-sm mt-2">Submit a user onboarding request for Entra ID, AD, and M365</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Demo Notice */}
        <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-6 mb-8">
          <p className="text-blue-200">
            💡 <strong>This is a demo.</strong> Use your own email to test the approval workflow. You'll receive an approval request email, and can approve or deny the request to see the complete workflow in action.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Employee Information */}
          <div className="bg-slate-900 rounded-lg border border-blue-500 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              👤 Employee Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-white font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  name="employee_name"
                  value={formData.employee_name}
                  onChange={handleChange}
                  placeholder="e.g., Sarah Johnson"
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="employee_email"
                  value={formData.employee_email}
                  onChange={handleChange}
                  placeholder="e.g., sarah@company.com"
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-white font-semibold mb-2">Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
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
                <label className="block text-white font-semibold mb-2">Job Title *</label>
                <select
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
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
                <label className="block text-white font-semibold mb-2">Location *</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
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
                <label className="block text-white font-semibold mb-2">Worker Type *</label>
                <select
                  name="worker_type"
                  value={formData.worker_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
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
                <label className="block text-white font-semibold mb-2">Start Date *</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Manager Information */}
          <div className="bg-slate-900 rounded-lg border border-purple-500 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              👔 Manager Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manager Name */}
              <div>
                <label className="block text-white font-semibold mb-2">Manager Name *</label>
                <input
                  type="text"
                  name="manager_name"
                  value={formData.manager_name}
                  onChange={handleChange}
                  placeholder="e.g., John Smith"
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Manager Email */}
              <div>
                <label className="block text-white font-semibold mb-2">Manager Email *</label>
                <input
                  type="email"
                  name="manager_email"
                  value={formData.manager_email}
                  onChange={handleChange}
                  placeholder="e.g., john@company.com"
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          </div>

          {/* Get Suggestions */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleGetSuggestions}
              disabled={!formData.department || !formData.job_title}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              ✨ Get Role Mapping Suggestions
            </button>
          </div>

          {/* Suggested Mapping */}
          {suggestedMapping && (
            <div className="bg-cyan-900/20 border border-cyan-500 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                🎯 Suggested Provisioning
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Suggested AD OU</p>
                  <p className="text-white font-mono text-sm bg-slate-800 px-3 py-2 rounded">
                    {suggestedMapping.suggested_ad_ou}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Entra Groups</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedMapping.suggested_entra_groups.map((group: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-blue-600/30 border border-blue-500 text-blue-200 px-3 py-1 rounded-full text-sm"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">M365 License</p>
                  <p className="text-white font-semibold">{suggestedMapping.suggested_m365_license}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Suggested Applications</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedMapping.suggested_apps.map((app: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-green-600/30 border border-green-500 text-green-200 px-3 py-1 rounded text-sm"
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
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-6 py-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              {loading ? 'Submitting...' : '✅ Submit Request for Approval'}
            </button>
            <Link
              href="/multicloud-hub"
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
