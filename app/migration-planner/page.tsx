'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CSVUpload from './components/CSVUpload'
import AssessmentLoading from './components/AssessmentLoading'
import AssessmentResults from './components/AssessmentResults'
import MigrationTimeline from './components/MigrationTimeline'
import ReportDownloadModal from './components/ReportDownloadModal'

interface VM {
  name: string
  vcpu: number
  memory_gb: number
  storage_gb: number
  os: string
  annual_cost_onprem: number
}

interface Assessment {
  vm_name: string
  current_specs: {
    cpu: number
    memory_gb: number
    storage_gb: number
    os: string
    current_annual_cost: number
  }
  azure_recommendation: {
    vm_type: string
    vcpu: number
    memory_gb: number
    monthly_cost: number
    annual_cost: number
    annual_savings: number
    savings_percentage: number
  }
  migration_details: {
    approach: string
    complexity: 'LOW' | 'MEDIUM' | 'HIGH'
    estimated_downtime_hours: number
    data_transfer_size_gb: number
    data_transfer_time_hours: number
    tested_cutover: boolean
    rollback_available: boolean
  }
  dependencies: string[]
  risks: string[]
  ready_to_migrate: boolean
}

export default function MigrationPlannerPage() {
  const router = useRouter()
  const [step, setStep] = useState<'upload' | 'loading' | 'assessment' | 'timeline' | 'results'>('upload')
  const [vms, setVms] = useState<VM[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [showReportModal, setShowReportModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCSVUpload = async (uploadedVMs: VM[]) => {
    setVms(uploadedVMs)
    setStep('loading')
    setLoading(false) // Loading component handles its own progress
  }

  const handleAssessmentComplete = () => {
    // Perform the actual analysis
    const results = vms.map((vm) => analyzeVM(vm))
    setAssessments(results)
    setStep('assessment')
  }

  const analyzeVM = (vm: VM): Assessment => {
    // Sizing logic
    const azureType = recommendAzureType(vm.vcpu, vm.memory_gb)
    const monthlyCost = getAzurePrice(azureType)
    const annualCost = monthlyCost * 12
    const annualSavings = vm.annual_cost_onprem - annualCost
    const savingsPercentage = (annualSavings / vm.annual_cost_onprem) * 100

    // Complexity assessment
    let complexity: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'
    if (vm.storage_gb > 500 || vm.vcpu > 8) complexity = 'MEDIUM'
    if (vm.storage_gb > 1000 || vm.vcpu > 16) complexity = 'HIGH'

    return {
      vm_name: vm.name,
      current_specs: {
        cpu: vm.vcpu,
        memory_gb: vm.memory_gb,
        storage_gb: vm.storage_gb,
        os: vm.os,
        current_annual_cost: vm.annual_cost_onprem
      },
      azure_recommendation: {
        vm_type: azureType,
        vcpu: vm.vcpu,
        memory_gb: vm.memory_gb,
        monthly_cost: monthlyCost,
        annual_cost: annualCost,
        annual_savings: annualSavings,
        savings_percentage: savingsPercentage
      },
      migration_details: {
        approach: vm.storage_gb > 500 ? 'Site Recovery with testing' : 'Lift-and-shift',
        complexity: complexity,
        estimated_downtime_hours: complexity === 'LOW' ? 2 : complexity === 'MEDIUM' ? 4 : 8,
        data_transfer_size_gb: vm.storage_gb,
        data_transfer_time_hours: Math.ceil(vm.storage_gb / 100), // Assuming 100 GB/hour
        tested_cutover: true,
        rollback_available: true
      },
      dependencies: [],
      risks: [],
      ready_to_migrate: true
    }
  }

  const recommendAzureType = (vcpu: number, memory: number): string => {
    if (vcpu <= 2 && memory <= 8) return 'Standard_B2s'
    if (vcpu <= 4 && memory <= 16) return 'Standard_D4s_v3'
    if (vcpu <= 8 && memory <= 32) return 'Standard_D8s_v3'
    if (vcpu <= 16 && memory <= 64) return 'Standard_D16s_v3'
    return 'Standard_D32s_v3'
  }

  const getAzurePrice = (vmType: string): number => {
    const prices: Record<string, number> = {
      'Standard_B2s': 85,
      'Standard_D4s_v3': 298,
      'Standard_D8s_v3': 596,
      'Standard_D16s_v3': 1192,
      'Standard_D32s_v3': 2384
    }
    return prices[vmType] || 298
  }

  const totalCurrentCost = vms.reduce((sum, vm) => sum + vm.annual_cost_onprem, 0)
  const totalAzureCost = assessments.reduce((sum, a) => sum + a.azure_recommendation.annual_cost, 0)
  const totalSavings = totalCurrentCost - totalAzureCost

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={() => {
                  if (step === 'upload') {
                    // Exit to dashboard when on upload page
                    router.push('/dashboard')
                  } else {
                    // Reset to upload for other steps
                    setStep('upload')
                    setVms([])
                    setAssessments([])
                    setShowReportModal(false)
                  }
                }}
                className="text-sm font-semibold flex items-center gap-2 mb-2 hover:opacity-70 transition"
                style={{ color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ← {step === 'upload' ? 'Back to Dashboard' : 'Back to Upload'}
              </button>
              <h1 className="text-3xl font-bold" style={{ color: '#111827' }}>
                VMware to Azure Migration Planner
              </h1>
              <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                Assess your on-prem infrastructure and plan your cloud migration
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {['Upload', 'Assessment', 'Timeline', 'Results'].map((label, idx) => (
              <div
                key={label}
                className="flex items-center"
                style={{ opacity: idx <= (['upload', 'assessment', 'timeline', 'results'].indexOf(step)) ? 1 : 0.5 }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mr-3 transition"
                  style={{
                    backgroundColor:
                      idx < ['upload', 'assessment', 'timeline', 'results'].indexOf(step)
                        ? '#10B981'
                        : idx === ['upload', 'assessment', 'timeline', 'results'].indexOf(step)
                        ? '#2563EB'
                        : '#E5E7EB',
                    color: idx <= ['upload', 'assessment', 'timeline', 'results'].indexOf(step) ? '#FFFFFF' : '#9CA3AF'
                  }}
                >
                  {idx + 1}
                </div>
                <span style={{ color: '#6B7280' }} className="font-semibold">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${((['upload', 'assessment', 'timeline', 'results'].indexOf(step) + 1) / 4) * 100}%`,
                backgroundColor: '#2563EB'
              }}
            />
          </div>
        </div>

        {/* Content */}
        {step === 'upload' && (
          <CSVUpload onUpload={handleCSVUpload} loading={loading} />
        )}

        {step === 'loading' && vms.length > 0 && (
          <AssessmentLoading vmCount={vms.length} onComplete={handleAssessmentComplete} />
        )}

        {step === 'assessment' && assessments.length > 0 && (
          <AssessmentResults
            assessments={assessments}
            vms={vms}
            totalCurrentCost={totalCurrentCost}
            totalAzureCost={totalAzureCost}
            onNext={() => setStep('timeline')}
          />
        )}

        {step === 'timeline' && (
          <MigrationTimeline
            assessments={assessments}
            totalCurrentCost={totalCurrentCost}
            totalAzureCost={totalAzureCost}
            onNext={() => setStep('results')}
            onDownloadReport={() => setShowReportModal(true)}
          />
        )}

        {showReportModal && (
          <ReportDownloadModal
            data={{
              vms,
              assessments,
              totalCurrentCost,
              totalAzureCost,
              totalSavings,
              timeline: '8'
            }}
            onClose={() => setShowReportModal(false)}
          />
        )}
      </main>
    </div>
  )
}
