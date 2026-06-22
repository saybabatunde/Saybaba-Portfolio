'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface RoleMapping {
  id: string
  department: string
  job_title: string
  location: string
  m365_license: string
  entra_groups: string[]
  security_groups: string[]
  applications: string[]
  vpn_access: string
  azure_resources: string[]
  aws_roles: string[]
}

const SAMPLE_MAPPINGS: RoleMapping[] = [
  {
    id: '1',
    department: 'Finance',
    job_title: 'Finance Analyst',
    location: 'Canada',
    m365_license: 'Microsoft 365 E3',
    entra_groups: ['Finance-All', 'Finance-Analyst', 'Location-Canada'],
    security_groups: ['Finance-SharePoint', 'Finance-Teams'],
    applications: ['SAP Finance', 'Power BI', 'Azure Storage'],
    vpn_access: 'VPN-Canada',
    azure_resources: ['Finance-Storage', 'Finance-SQL'],
    aws_roles: ['arn:aws:iam::123456789:role/Finance-ReadOnly'],
  },
  {
    id: '2',
    department: 'Engineering',
    job_title: 'Senior Engineer',
    location: 'Remote',
    m365_license: 'Microsoft 365 E5',
    entra_groups: ['Engineering-All', 'Engineering-Senior', 'Remote-Access'],
    security_groups: ['Engineering-GitHub', 'Engineering-DevOps'],
    applications: ['GitHub', 'Azure DevOps', 'Visual Studio', 'AWS Console'],
    vpn_access: 'VPN-Remote',
    azure_resources: ['Engineering-VMs', 'Engineering-Functions'],
    aws_roles: ['arn:aws:iam::123456789:role/Engineering-Developer'],
  },
  {
    id: '3',
    department: 'Sales',
    job_title: 'Sales Manager',
    location: 'USA',
    m365_license: 'Microsoft 365 E3',
    entra_groups: ['Sales-All', 'Sales-Management', 'Location-USA'],
    security_groups: ['Sales-Salesforce', 'Sales-Analytics'],
    applications: ['Salesforce', 'Tableau', 'Dynamics 365'],
    vpn_access: 'VPN-USA',
    azure_resources: ['Sales-Analytics'],
    aws_roles: [],
  },
]

export default function RoleMapping() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mappings, setMappings] = useState<RoleMapping[]>(SAMPLE_MAPPINGS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedMapping, setSelectedMapping] = useState<RoleMapping | null>(null)

  useEffect(() => {
    const logged_in = localStorage.getItem('logged_in')
    const user = localStorage.getItem('username')

    if (!logged_in || !user) {
      router.push('/')
      return
    }

    setIsAuthenticated(true)
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-pink-900 border-b border-purple-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/multicloud-hub"
            className="text-purple-300 hover:text-purple-200 font-semibold transition flex items-center gap-2 mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Role Mapping Matrix</h1>
          <p className="text-purple-200 text-sm mt-2">
            Map departments, job titles, and locations to groups, licenses, and cloud access
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Info Banner */}
        <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-6 mb-8">
          <h3 className="text-white font-bold mb-2">📋 How Role Mapping Works</h3>
          <p className="text-purple-200 text-sm">
            When a user with a specific Department + Job Title + Location is onboarded, the system looks up this matrix
            and automatically suggests: Entra groups, M365 licenses, security groups, applications, cloud access, and VPN
            configuration.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-lg border border-purple-500 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Role Mappings</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {mappings.map((mapping) => (
                  <button
                    key={mapping.id}
                    onClick={() => setSelectedMapping(mapping)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedMapping?.id === mapping.id
                        ? 'bg-purple-600 border border-purple-400'
                        : 'bg-slate-800 border border-gray-600 hover:border-purple-400'
                    }`}
                  >
                    <p className="text-white font-semibold text-sm">{mapping.department}</p>
                    <p className="text-gray-400 text-xs">{mapping.job_title}</p>
                    <p className="text-gray-500 text-xs">{mapping.location}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            {selectedMapping ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg border border-purple-500 p-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {selectedMapping.job_title} in {selectedMapping.department}
                  </h2>
                  <p className="text-purple-200 text-lg">📍 {selectedMapping.location}</p>
                </div>

                {/* M365 License */}
                <div className="bg-slate-900 rounded-lg border border-blue-500 p-6">
                  <h3 className="text-lg font-bold text-white mb-3">💻 M365 License</h3>
                  <p className="text-blue-300 text-lg font-semibold">{selectedMapping.m365_license}</p>
                </div>

                {/* Entra Groups */}
                <div className="bg-slate-900 rounded-lg border border-green-500 p-6">
                  <h3 className="text-lg font-bold text-white mb-3">👥 Entra Groups</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMapping.entra_groups.map((group, idx) => (
                      <span
                        key={idx}
                        className="bg-green-600/30 border border-green-500 text-green-200 px-3 py-1 rounded-full text-sm"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Security Groups */}
                <div className="bg-slate-900 rounded-lg border border-yellow-500 p-6">
                  <h3 className="text-lg font-bold text-white mb-3">🔐 Security Groups</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMapping.security_groups.map((group, idx) => (
                      <span key={idx} className="bg-yellow-600/30 border border-yellow-500 text-yellow-200 px-3 py-1 rounded text-sm">
                        {group}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Applications */}
                <div className="bg-slate-900 rounded-lg border border-cyan-500 p-6">
                  <h3 className="text-lg font-bold text-white mb-3">📱 Applications</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMapping.applications.map((app, idx) => (
                      <span
                        key={idx}
                        className="bg-cyan-600/30 border border-cyan-500 text-cyan-200 px-3 py-1 rounded text-sm"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                {/* VPN Access */}
                <div className="bg-slate-900 rounded-lg border border-orange-500 p-6">
                  <h3 className="text-lg font-bold text-white mb-3">🔑 VPN Access</h3>
                  <p className="text-orange-300 font-semibold">{selectedMapping.vpn_access}</p>
                </div>

                {/* Azure Resources */}
                <div className="bg-slate-900 rounded-lg border border-blue-600 p-6">
                  <h3 className="text-lg font-bold text-white mb-3">☁️ Azure Resources</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMapping.azure_resources.length > 0 ? (
                      selectedMapping.azure_resources.map((resource, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-600/30 border border-blue-600 text-blue-200 px-3 py-1 rounded text-sm"
                        >
                          {resource}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400">No Azure resources</p>
                    )}
                  </div>
                </div>

                {/* AWS Roles */}
                <div className="bg-slate-900 rounded-lg border border-orange-600 p-6">
                  <h3 className="text-lg font-bold text-white mb-3">⚙️ AWS Roles</h3>
                  <div className="space-y-2">
                    {selectedMapping.aws_roles.length > 0 ? (
                      selectedMapping.aws_roles.map((role, idx) => (
                        <p key={idx} className="text-orange-300 font-mono text-sm bg-slate-800 px-3 py-2 rounded">
                          {role}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-400">No AWS roles</p>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition">
                  ✏️ Edit This Mapping
                </button>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-lg border border-gray-600 p-12 text-center">
                <p className="text-gray-400 text-lg">Select a mapping from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
