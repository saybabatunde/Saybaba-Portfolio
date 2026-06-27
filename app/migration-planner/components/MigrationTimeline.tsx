'use client'

interface Assessment {
  vm_name: string
  migration_details: {
    complexity: 'LOW' | 'MEDIUM' | 'HIGH'
  }
}

interface MigrationTimelineProps {
  assessments: Assessment[]
  totalCurrentCost: number
  totalAzureCost: number
  onNext: () => void
  onDownloadReport: () => void
}

export default function MigrationTimeline({
  assessments,
  totalCurrentCost,
  totalAzureCost,
  onDownloadReport
}: MigrationTimelineProps) {
  const lowRiskVMs = assessments.filter(a => a.migration_details.complexity === 'LOW')
  const mediumRiskVMs = assessments.filter(a => a.migration_details.complexity === 'MEDIUM')
  const highRiskVMs = assessments.filter(a => a.migration_details.complexity === 'HIGH')

  const totalSavings = totalCurrentCost - totalAzureCost
  const savingsPercentage = (totalSavings / totalCurrentCost) * 100

  const phases = [
    {
      week: '1-2',
      title: 'Preparation & Validation',
      tasks: [
        'Set up Azure subscriptions',
        'Establish VPN/ExpressRoute',
        'Backup all systems',
        'Create test environment'
      ],
      vms: 0,
      color: '#3B82F6'
    },
    {
      week: '3-4',
      title: `Phase 1: Dev/Test (${lowRiskVMs.length} VMs)`,
      tasks: [
        'Migrate non-critical systems',
        'Validate migration process',
        'Performance testing',
        'Iterative improvements'
      ],
      vms: lowRiskVMs.length,
      color: '#10B981'
    },
    {
      week: '5-6',
      title: `Phase 2: Non-Critical Production (${mediumRiskVMs.length} VMs)`,
      tasks: [
        'Migrate internal systems',
        'Set up database replication',
        'Monitor performance',
        'Document issues & solutions'
      ],
      vms: mediumRiskVMs.length,
      color: '#F59E0B'
    },
    {
      week: '7-8',
      title: `Phase 3: Critical Production (${highRiskVMs.length} VMs)`,
      tasks: [
        'Migrate customer-facing apps',
        'Minimal downtime cutover',
        'Real-time monitoring',
        'Immediate rollback ready'
      ],
      vms: highRiskVMs.length,
      color: '#EF4444'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Overview */}
      <div className="rounded-lg p-8" style={{ backgroundColor: '#F0F9FF', border: '2px solid #BFDBFE' }}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E40AF' }}>
          8-Week Migration Timeline
        </h2>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <p style={{ color: '#6B7280' }} className="text-sm font-semibold mb-2">
              Total Timeline
            </p>
            <p className="text-2xl font-bold" style={{ color: '#1E40AF' }}>
              8 Weeks
            </p>
          </div>
          <div>
            <p style={{ color: '#6B7280' }} className="text-sm font-semibold mb-2">
              Phases
            </p>
            <p className="text-2xl font-bold" style={{ color: '#1E40AF' }}>
              4 Stages
            </p>
          </div>
          <div>
            <p style={{ color: '#6B7280' }} className="text-sm font-semibold mb-2">
              Annual Savings
            </p>
            <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
              ${(totalSavings / 1000).toFixed(0)}k
            </p>
          </div>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="space-y-6">
        {phases.map((phase, idx) => (
          <div key={idx} className="rounded-lg overflow-hidden border-2" style={{ borderColor: phase.color }}>
            <div className="px-6 py-4" style={{ backgroundColor: phase.color }}>
              <h3 className="text-lg font-bold text-white">
                📅 Week {phase.week}: {phase.title}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-3" style={{ color: '#111827' }}>
                    Tasks
                  </h4>
                  <ul className="space-y-2">
                    {phase.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span style={{ color: phase.color }} className="font-bold mt-1">
                          ✓
                        </span>
                        <span style={{ color: '#374151' }}>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-3" style={{ color: '#111827' }}>
                    Migration Details
                  </h4>
                  <div className="space-y-2" style={{ color: '#374151' }}>
                    <p>
                      <span className="font-semibold">VMs:</span> {phase.vms}
                    </p>
                    <p>
                      <span className="font-semibold">Approach:</span> {phase.vms > 0 ? 'Site Recovery' : 'Setup & Preparation'}
                    </p>
                    <p>
                      <span className="font-semibold">Estimated Time:</span> 2 weeks
                    </p>
                    <p>
                      <span className="font-semibold">Risk Level:</span>{' '}
                      {idx === 0 ? '🟢 Low' : idx === 1 ? '🟢 Low' : idx === 2 ? '🟡 Medium' : '🔴 High'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Success Criteria */}
      <div className="rounded-lg p-6" style={{ backgroundColor: '#DCFCE7', border: '2px solid #86EFAC' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#15803D' }}>
          ✅ Post-Migration Success Metrics
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p style={{ color: '#166534' }} className="font-semibold">
              ✓ All VMs Running in Azure
            </p>
            <p style={{ color: '#374151' }} className="text-sm">
              100% of workloads migrated and operational
            </p>
          </div>
          <div>
            <p style={{ color: '#166534' }} className="font-semibold">
              ✓ Cost Baseline Established
            </p>
            <p style={{ color: '#374151' }} className="text-sm">
              ${(totalAzureCost / 1000).toFixed(0)}k/year vs ${(totalCurrentCost / 1000).toFixed(0)}k current
            </p>
          </div>
          <div>
            <p style={{ color: '#166534' }} className="font-semibold">
              ✓ 99.95% Uptime SLA
            </p>
            <p style={{ color: '#374151' }} className="text-sm">
              Achieved through Azure managed services
            </p>
          </div>
          <div>
            <p style={{ color: '#166534' }} className="font-semibold">
              ✓ On-Prem Resources Decommissioned
            </p>
            <p style={{ color: '#374151' }} className="text-sm">
              After 30-day validation period
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-8">
        <div>
          <p style={{ color: '#6B7280' }} className="text-sm">
            Ready to get started?
          </p>
          <p style={{ color: '#111827' }} className="font-semibold">
            Generate a detailed migration report for your team
          </p>
        </div>
        <button
          onClick={onDownloadReport}
          className="font-bold py-3 px-8 rounded-lg transition text-white"
          style={{ backgroundColor: '#2563EB' }}
        >
          📥 Download Detailed Report →
        </button>
      </div>
    </div>
  )
}
