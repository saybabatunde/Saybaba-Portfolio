'use client'

import { useState } from 'react'

interface Assessment {
  vm_name: string
  azure_recommendation: {
    vm_type: string
    monthly_cost: number
    annual_cost: number
    savings_percentage: number
  }
  migration_details: {
    complexity: 'LOW' | 'MEDIUM' | 'HIGH'
    estimated_downtime_hours: number
  }
}

interface VM {
  name: string
  vcpu: number
  memory_gb: number
  storage_gb: number
}

interface AssessmentResultsProps {
  assessments: Assessment[]
  vms: VM[]
  totalCurrentCost: number
  totalAzureCost: number
  onNext: () => void
}

export default function AssessmentResults({
  assessments,
  totalCurrentCost,
  totalAzureCost,
  onNext
}: AssessmentResultsProps) {
  const [sortBy, setSortBy] = useState<'savings' | 'complexity'>('savings')
  const totalSavings = totalCurrentCost - totalAzureCost
  const savingsPercentage = (totalSavings / totalCurrentCost) * 100

  const sortedAssessments = [...assessments].sort((a, b) => {
    if (sortBy === 'savings') {
      return b.azure_recommendation.savings_percentage - a.azure_recommendation.savings_percentage
    }
    const complexityOrder = { LOW: 0, MEDIUM: 1, HIGH: 2 }
    return complexityOrder[b.migration_details.complexity] - complexityOrder[a.migration_details.complexity]
  })

  const lowRisk = assessments.filter(a => a.migration_details.complexity === 'LOW').length
  const mediumRisk = assessments.filter(a => a.migration_details.complexity === 'MEDIUM').length
  const highRisk = assessments.filter(a => a.migration_details.complexity === 'HIGH').length

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-lg p-6" style={{ backgroundColor: '#F0F9FF', border: '2px solid #BFDBFE' }}>
          <p style={{ color: '#6B7280' }} className="text-sm font-semibold mb-2">
            Total VMs Analyzed
          </p>
          <p className="text-3xl font-bold" style={{ color: '#1E40AF' }}>
            {assessments.length}
          </p>
        </div>

        <div className="rounded-lg p-6" style={{ backgroundColor: '#F0F9FF', border: '2px solid #10B981' }}>
          <p style={{ color: '#6B7280' }} className="text-sm font-semibold mb-2">
            Annual Savings
          </p>
          <p className="text-3xl font-bold" style={{ color: '#10B981' }}>
            ${(totalSavings / 1000).toFixed(0)}k
          </p>
          <p style={{ color: '#059669' }} className="text-xs mt-1">
            {savingsPercentage.toFixed(0)}% reduction
          </p>
        </div>

        <div className="rounded-lg p-6" style={{ backgroundColor: '#FEF3C7', border: '2px solid #FCD34D' }}>
          <p style={{ color: '#6B7280' }} className="text-sm font-semibold mb-2">
            Current Cost
          </p>
          <p className="text-3xl font-bold" style={{ color: '#92400E' }}>
            ${(totalCurrentCost / 1000).toFixed(0)}k
          </p>
        </div>

        <div className="rounded-lg p-6" style={{ backgroundColor: '#DCFCE7', border: '2px solid #86EFAC' }}>
          <p style={{ color: '#6B7280' }} className="text-sm font-semibold mb-2">
            Azure Cost
          </p>
          <p className="text-3xl font-bold" style={{ color: '#15803D' }}>
            ${(totalAzureCost / 1000).toFixed(0)}k
          </p>
        </div>
      </div>

      {/* Risk Summary */}
      <div className="rounded-lg p-6" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#111827' }}>
          Migration Risk Assessment
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p style={{ color: '#10B981' }} className="font-semibold">
              🟢 Low Risk ({lowRisk} VMs)
            </p>
            <p style={{ color: '#6B7280' }} className="text-sm mt-1">
              Stateless apps, easy rollback
            </p>
          </div>
          <div>
            <p style={{ color: '#F59E0B' }} className="font-semibold">
              🟡 Medium Risk ({mediumRisk} VMs)
            </p>
            <p style={{ color: '#6B7280' }} className="text-sm mt-1">
              Databases, some dependencies
            </p>
          </div>
          <div>
            <p style={{ color: '#EF4444' }} className="font-semibold">
              🔴 High Risk ({highRisk} VMs)
            </p>
            <p style={{ color: '#6B7280' }} className="text-sm mt-1">
              Complex integrations, custom apps
            </p>
          </div>
        </div>
      </div>

      {/* VM Assessment Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold" style={{ color: '#111827' }}>
            Individual VM Analysis
          </h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'savings' | 'complexity')}
            className="px-4 py-2 border-2 rounded-lg"
            style={{ borderColor: '#D1D5DB', color: '#374151' }}
          >
            <option value="savings">Sort by Savings</option>
            <option value="complexity">Sort by Complexity</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#F3F4F6' }}>
              <tr>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#374151' }}>
                  VM Name
                </th>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#374151' }}>
                  Recommended
                </th>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#374151' }}>
                  Monthly Cost
                </th>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#374151' }}>
                  Annual Savings
                </th>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#374151' }}>
                  Complexity
                </th>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#374151' }}>
                  Downtime
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAssessments.map((assessment, idx) => (
                <tr key={idx} style={{ borderTop: '1px solid #E5E7EB' }}>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#111827' }}>
                    {assessment.vm_name}
                  </td>
                  <td className="px-4 py-3" style={{ color: '#374151' }}>
                    {assessment.azure_recommendation.vm_type}
                  </td>
                  <td className="px-4 py-3" style={{ color: '#374151' }}>
                    ${assessment.azure_recommendation.monthly_cost}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      style={{
                        color: '#10B981',
                        fontWeight: 'bold'
                      }}
                    >
                      {assessment.azure_recommendation.savings_percentage.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-3 py-1 rounded font-semibold text-white"
                      style={{
                        backgroundColor:
                          assessment.migration_details.complexity === 'LOW'
                            ? '#10B981'
                            : assessment.migration_details.complexity === 'MEDIUM'
                            ? '#F59E0B'
                            : '#EF4444'
                      }}
                    >
                      {assessment.migration_details.complexity}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#374151' }}>
                    {assessment.migration_details.estimated_downtime_hours}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-8">
        <button
          onClick={onNext}
          className="font-bold py-3 px-8 rounded-lg transition text-white"
          style={{ backgroundColor: '#2563EB' }}
        >
          Continue to Migration Timeline →
        </button>
      </div>
    </div>
  )
}
