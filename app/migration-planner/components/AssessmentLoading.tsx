'use client'

import { useEffect, useState } from 'react'

interface AssessmentLoadingProps {
  vmCount: number
  onComplete: () => void
}

export default function AssessmentLoading({ vmCount, onComplete }: AssessmentLoadingProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState('Initializing assessment...')

  const steps = [
    'Initializing assessment...',
    'Scanning VM specifications...',
    'Analyzing CPU configurations...',
    'Evaluating memory allocation...',
    'Assessing storage requirements...',
    'Checking OS compatibility...',
    'Reviewing current costs...',
    'Calculating Azure recommendations...',
    'Determining VM sizes...',
    'Computing cost savings...',
    'Assessing migration complexity...',
    'Evaluating dependencies...',
    'Planning phased migration...',
    'Finalizing assessment...'
  ]

  useEffect(() => {
    // Simulate assessment progress over 30 seconds
    const totalDuration = 30000 // 30 seconds in ms
    const startTime = Date.now()
    const stepDuration = totalDuration / steps.length

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100)

      setProgress(newProgress)

      // Update step based on progress
      const stepIndex = Math.floor((newProgress / 100) * steps.length)
      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex])
      }

      // Complete when we reach 100%
      if (newProgress >= 100) {
        setProgress(100)
        setCurrentStep('Assessment complete!')
        setIsComplete(true)
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#111827' }}>
          🔍 Analyzing Your Infrastructure
        </h2>
        <p style={{ color: '#6B7280' }}>
          Processing {vmCount} VMs and generating migration recommendations...
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-4">
        <div
          className="rounded-full overflow-hidden h-3"
          style={{
            backgroundColor: '#E5E7EB',
            border: '1px solid #D1D5DB'
          }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)'
            }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span style={{ color: '#6B7280' }} className="text-sm font-semibold">
            Progress
          </span>
          <span style={{ color: '#2563EB' }} className="text-sm font-bold">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Current Step */}
      <div className="rounded-lg p-8" style={{ backgroundColor: '#F0F9FF', border: '2px solid #BFDBFE' }}>
        <p style={{ color: '#1E40AF' }} className="font-semibold text-lg">
          {currentStep}
        </p>
      </div>

      {/* VM Count */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg p-4" style={{ backgroundColor: '#F3F4F6' }}>
          <p style={{ color: '#6B7280' }} className="text-xs font-semibold">
            VMs Processed
          </p>
          <p style={{ color: '#111827' }} className="text-2xl font-bold mt-2">
            {vmCount}
          </p>
        </div>
        <div className="rounded-lg p-4" style={{ backgroundColor: '#F3F4F6' }}>
          <p style={{ color: '#6B7280' }} className="text-xs font-semibold">
            Time Elapsed
          </p>
          <p style={{ color: '#111827' }} className="text-2xl font-bold mt-2">
            {Math.round((progress / 100) * 90)}s
          </p>
        </div>
        <div className="rounded-lg p-4" style={{ backgroundColor: '#F3F4F6' }}>
          <p style={{ color: '#6B7280' }} className="text-xs font-semibold">
            Time Left
          </p>
          <p style={{ color: '#111827' }} className="text-2xl font-bold mt-2">
            {Math.max(0, Math.round(90 - (progress / 100) * 90))}s
          </p>
        </div>
      </div>

      {/* Complete Message */}
      {isComplete && (
        <div className="rounded-lg p-8 animate-pulse" style={{ backgroundColor: '#DCFCE7', border: '2px solid #86EFAC' }}>
          <p style={{ color: '#15803D' }} className="font-bold text-lg mb-4">
            ✅ Assessment Complete!
          </p>
          <p style={{ color: '#166534' }} className="mb-6">
            Your infrastructure analysis is ready. Click the button below to review your migration timeline and download your detailed report.
          </p>
          <button
            onClick={onComplete}
            className="font-bold py-3 px-8 rounded-lg transition text-white"
            style={{ backgroundColor: '#10B981' }}
          >
            📋 Review Timeline & Download Report →
          </button>
        </div>
      )}

      {/* Processing Note */}
      {!isComplete && (
        <p style={{ color: '#9CA3AF' }} className="text-xs italic">
          This simulates a comprehensive infrastructure analysis including cost calculations, complexity assessment, and migration planning.
        </p>
      )}
    </div>
  )
}
