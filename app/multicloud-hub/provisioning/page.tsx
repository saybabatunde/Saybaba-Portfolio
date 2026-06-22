'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ProvisioningRun {
  id: string
  request_name: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  started_at: string
  completed_at?: string
  generated_username: string
  generated_email: string
  steps: ProvisioningStep[]
}

interface ProvisioningStep {
  step_number: number
  step_name: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  result: string
  started_at?: string
  completed_at?: string
}

const SAMPLE_RUNS: ProvisioningRun[] = [
  {
    id: '1',
    request_name: 'Sarah Johnson - Finance Analyst',
    status: 'completed',
    started_at: '2 hours ago',
    completed_at: '1 hour ago',
    generated_username: 'sjohnson',
    generated_email: 'sjohnson@company.com',
    steps: [
      {
        step_number: 1,
        step_name: 'Validate User Profile',
        status: 'completed',
        result: 'Profile validation passed. Department: Finance, Location: Canada verified.',
        started_at: '2 hours ago',
        completed_at: '1 hour 58 min ago',
      },
      {
        step_number: 2,
        step_name: 'Generate Username',
        status: 'completed',
        result: 'Username generated: sjohnson',
        started_at: '1 hour 58 min ago',
        completed_at: '1 hour 57 min ago',
      },
      {
        step_number: 3,
        step_name: 'Assign Active Directory OU',
        status: 'completed',
        result: 'Assigned to: OU=Finance,OU=Users,DC=company,DC=com',
        started_at: '1 hour 57 min ago',
        completed_at: '1 hour 55 min ago',
      },
      {
        step_number: 4,
        step_name: 'Assign Entra Groups',
        status: 'completed',
        result: 'Added to 4 groups: Finance-All, Finance-Analyst, Location-Canada, Employees',
        started_at: '1 hour 55 min ago',
        completed_at: '1 hour 50 min ago',
      },
      {
        step_number: 5,
        step_name: 'Trigger Azure Function',
        status: 'completed',
        result: 'Azure Function invoked: simulate-entra-provisioning (execution time: 245ms)',
        started_at: '1 hour 50 min ago',
        completed_at: '1 hour 48 min ago',
      },
      {
        step_number: 6,
        step_name: 'Trigger AWS Lambda Audit Hook',
        status: 'completed',
        result: 'AWS Lambda invoked: simulate-audit-log (execution time: 158ms)',
        started_at: '1 hour 48 min ago',
        completed_at: '1 hour 46 min ago',
      },
      {
        step_number: 7,
        step_name: 'Write Audit Log',
        status: 'completed',
        result: 'Audit log entry created with ID: audit-001-sjohnson',
        started_at: '1 hour 46 min ago',
        completed_at: '1 hour 45 min ago',
      },
      {
        step_number: 8,
        step_name: 'Mark Completed',
        status: 'completed',
        result: 'Provisioning marked as completed. User ready for first login.',
        started_at: '1 hour 45 min ago',
        completed_at: '1 hour ago',
      },
    ],
  },
  {
    id: '2',
    request_name: 'Mike Chen - Senior Engineer',
    status: 'in_progress',
    started_at: '15 minutes ago',
    generated_username: 'mchen',
    generated_email: 'mchen@company.com',
    steps: [
      {
        step_number: 1,
        step_name: 'Validate User Profile',
        status: 'completed',
        result: 'Profile validation passed.',
      },
      {
        step_number: 2,
        step_name: 'Generate Username',
        status: 'completed',
        result: 'Username generated: mchen',
      },
      {
        step_number: 3,
        step_name: 'Assign Active Directory OU',
        status: 'in_progress',
        result: 'Processing OU assignment...',
      },
      {
        step_number: 4,
        step_name: 'Assign Entra Groups',
        status: 'pending',
        result: 'Waiting to start...',
      },
      {
        step_number: 5,
        step_name: 'Trigger Azure Function',
        status: 'pending',
        result: 'Waiting to start...',
      },
      {
        step_number: 6,
        step_name: 'Trigger AWS Lambda Audit Hook',
        status: 'pending',
        result: 'Waiting to start...',
      },
      {
        step_number: 7,
        step_name: 'Write Audit Log',
        status: 'pending',
        result: 'Waiting to start...',
      },
      {
        step_number: 8,
        step_name: 'Mark Completed',
        status: 'pending',
        result: 'Waiting to start...',
      },
    ],
  },
]

export default function ProvisioningRuns() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [runs, setRuns] = useState<ProvisioningRun[]>(SAMPLE_RUNS)
  const [selectedRun, setSelectedRun] = useState<ProvisioningRun | null>(SAMPLE_RUNS[0])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400'
      case 'in_progress':
        return 'text-yellow-400'
      case 'failed':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/30 border-green-600'
      case 'in_progress':
        return 'bg-yellow-900/30 border-yellow-600'
      case 'failed':
        return 'bg-red-900/30 border-red-600'
      default:
        return 'bg-gray-900/30 border-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 to-blue-900 border-b border-indigo-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/multicloud-hub"
            className="text-indigo-300 hover:text-indigo-200 font-semibold transition flex items-center gap-2 mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Provisioning Simulation Runs</h1>
          <p className="text-indigo-200 text-sm mt-2">Track end-to-end provisioning workflows step by step</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Info Banner */}
        <div className="bg-indigo-900/20 border border-indigo-500 rounded-lg p-6 mb-8">
          <h3 className="text-white font-bold mb-2">🚀 Provisioning Workflow</h3>
          <p className="text-indigo-200 text-sm">
            When a request is approved, the system orchestrates 8 steps: validation, username generation, AD OU
            assignment, Entra group assignment, Azure Function invocation, AWS Lambda audit hook, audit log creation,
            and completion marking.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* List */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-lg border border-indigo-500 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Provisioning Runs</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {runs.map((run) => (
                  <button
                    key={run.id}
                    onClick={() => setSelectedRun(run)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedRun?.id === run.id
                        ? 'bg-indigo-600 border border-indigo-400'
                        : 'bg-slate-800 border border-gray-600 hover:border-indigo-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white font-semibold text-sm">{run.request_name}</p>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          run.status === 'completed'
                            ? 'bg-green-600/30 text-green-300'
                            : run.status === 'in_progress'
                              ? 'bg-yellow-600/30 text-yellow-300'
                              : 'bg-gray-600/30 text-gray-300'
                        }`}
                      >
                        {run.status === 'in_progress' ? '⏳' : run.status === 'completed' ? '✅' : '⏸'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">Started {run.started_at}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-3">
            {selectedRun ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-lg border border-indigo-500 p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedRun.request_name}</h2>
                      <p className="text-indigo-200 text-sm mt-1">Started: {selectedRun.started_at}</p>
                    </div>
                    <span
                      className={`text-xl font-bold px-4 py-2 rounded-lg ${
                        selectedRun.status === 'completed'
                          ? 'bg-green-600/30 text-green-300 border border-green-600'
                          : selectedRun.status === 'in_progress'
                            ? 'bg-yellow-600/30 text-yellow-300 border border-yellow-600'
                            : 'bg-gray-600/30 text-gray-300 border border-gray-600'
                      }`}
                    >
                      {selectedRun.status === 'in_progress' ? '⏳ IN PROGRESS' : selectedRun.status === 'completed' ? '✅ COMPLETED' : '❌ FAILED'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <p className="text-indigo-300 text-sm">Generated Username</p>
                      <p className="text-white font-mono font-bold">{selectedRun.generated_username}</p>
                    </div>
                    <div>
                      <p className="text-indigo-300 text-sm">Generated Email</p>
                      <p className="text-white font-mono">{selectedRun.generated_email}</p>
                    </div>
                  </div>
                </div>

                {/* Steps Timeline */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">📋 Provisioning Steps</h3>
                  {selectedRun.steps.map((step, idx) => (
                    <div key={step.step_number} className={`rounded-lg border-l-4 p-6 ${getStatusBg(step.status)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">
                            {step.status === 'completed' ? '✅' : step.status === 'in_progress' ? '⏳' : step.status === 'failed' ? '❌' : '⏸'}
                          </div>
                          <div>
                            <p className="text-white font-bold text-lg">
                              Step {step.step_number}: {step.step_name}
                            </p>
                            <p className={`text-sm font-semibold ${getStatusColor(step.status)}`}>
                              {step.status.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm bg-slate-800/50 px-3 py-2 rounded font-mono">
                        {step.result}
                      </p>

                      {(step.started_at || step.completed_at) && (
                        <p className="text-gray-500 text-xs mt-3">
                          {step.started_at && `Started: ${step.started_at}`}
                          {step.started_at && step.completed_at && ' • '}
                          {step.completed_at && `Completed: ${step.completed_at}`}
                        </p>
                      )}

                      {idx < selectedRun.steps.length - 1 && (
                        <div className="mt-4 ml-6 h-6 border-l-2 border-gray-600"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Summary Stats */}
                <div className="bg-slate-900 rounded-lg border border-gray-600 p-6 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Total Steps</p>
                    <p className="text-white font-bold text-2xl">{selectedRun.steps.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Completed</p>
                    <p className="text-green-400 font-bold text-2xl">
                      {selectedRun.steps.filter((s) => s.status === 'completed').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Time Duration</p>
                    <p className="text-white font-bold text-2xl">
                      {selectedRun.status === 'completed' ? '~1h' : selectedRun.status === 'in_progress' ? 'In progress' : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-lg border border-gray-600 p-12 text-center">
                <p className="text-gray-400 text-lg">Select a run from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
