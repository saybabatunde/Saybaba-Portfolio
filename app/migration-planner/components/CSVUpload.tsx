'use client'

import { useState } from 'react'
import Papa from 'papaparse'

interface VM {
  name: string
  vcpu: number
  memory_gb: number
  storage_gb: number
  os: string
  annual_cost_onprem: number
}

interface CSVUploadProps {
  onUpload: (vms: VM[]) => void
  loading: boolean
}

const DEMO_DATA: VM[] = [
  { name: 'prod-web-01', vcpu: 4, memory_gb: 16, storage_gb: 100, os: 'Windows Server 2019', annual_cost_onprem: 5000 },
  { name: 'prod-db-01', vcpu: 8, memory_gb: 32, storage_gb: 500, os: 'Windows Server 2019', annual_cost_onprem: 12000 },
  { name: 'prod-app-01', vcpu: 4, memory_gb: 16, storage_gb: 150, os: 'Windows Server 2019', annual_cost_onprem: 5500 },
  { name: 'dev-vm-01', vcpu: 2, memory_gb: 8, storage_gb: 50, os: 'Windows Server 2019', annual_cost_onprem: 2000 },
  { name: 'dev-vm-02', vcpu: 2, memory_gb: 8, storage_gb: 50, os: 'Windows Server 2019', annual_cost_onprem: 2000 },
  { name: 'test-db-01', vcpu: 4, memory_gb: 16, storage_gb: 200, os: 'Windows Server 2019', annual_cost_onprem: 4500 },
  { name: 'app-server-01', vcpu: 4, memory_gb: 16, storage_gb: 100, os: 'Windows Server 2019', annual_cost_onprem: 4800 },
  { name: 'file-server-01', vcpu: 2, memory_gb: 8, storage_gb: 800, os: 'Windows Server 2019', annual_cost_onprem: 6000 },
]

export default function CSVUpload({ onUpload, loading }: CSVUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      parseCSV(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      parseCSV(e.target.files[0])
    }
  }

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const vms = results.data
          .filter((row: any) => row.name && row.vcpu)
          .map((row: any) => ({
            name: row.name,
            vcpu: parseInt(row.vcpu),
            memory_gb: parseInt(row.memory_gb),
            storage_gb: parseInt(row.storage_gb),
            os: row.os || 'Windows Server 2019',
            annual_cost_onprem: parseInt(row.annual_cost_onprem) || 5000
          }))

        if (vms.length > 0) {
          onUpload(vms)
        }
      },
      error: (error: any) => {
        alert(`Error parsing CSV: ${error.message}`)
      }
    })
  }

  const loadSampleCSV = async () => {
    try {
      const response = await fetch('/sample-vmware-inventory.csv')
      const csvContent = await response.text()

      Papa.parse(csvContent, {
        header: true,
        complete: (results) => {
          const vms = results.data
            .filter((row: any) => row.name && row.vcpu)
            .map((row: any) => ({
              name: row.name,
              vcpu: parseInt(row.vcpu),
              memory_gb: parseInt(row.memory_gb),
              storage_gb: parseInt(row.storage_gb),
              os: row.os || 'Windows Server 2019',
              annual_cost_onprem: parseInt(row.annual_cost_onprem) || 5000
            }))

          if (vms.length > 0) {
            onUpload(vms)
          }
        },
        error: (error: any) => {
          alert(`Error parsing CSV: ${error.message}`)
        }
      })
    } catch (error) {
      alert('Failed to load sample CSV')
    }
  }

  const downloadSampleCSV = () => {
    const link = document.createElement('a')
    link.href = '/sample-vmware-inventory.csv'
    link.download = 'sample-vmware-inventory.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const loadHeavySampleCSV = async () => {
    try {
      const response = await fetch('/heavy-sample-vmware-inventory.csv')
      const csvContent = await response.text()

      Papa.parse(csvContent, {
        header: true,
        complete: (results) => {
          const vms = results.data
            .filter((row: any) => row.name && row.vcpu)
            .map((row: any) => ({
              name: row.name,
              vcpu: parseInt(row.vcpu),
              memory_gb: parseInt(row.memory_gb),
              storage_gb: parseInt(row.storage_gb),
              os: row.os || 'Windows Server 2019',
              annual_cost_onprem: parseInt(row.annual_cost_onprem) || 5000
            }))

          if (vms.length > 0) {
            onUpload(vms)
          }
        },
        error: (error: any) => {
          alert(`Error parsing CSV: ${error.message}`)
        }
      })
    } catch (error) {
      alert('Failed to load heavy sample CSV')
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#111827' }}>
          Upload Your VMware Inventory
        </h2>
        <p style={{ color: '#6B7280' }}>
          Import your on-prem VM details to get migration recommendations and cost analysis
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Upload Section */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition"
          style={{
            borderColor: dragActive ? '#2563EB' : '#D1D5DB',
            backgroundColor: dragActive ? '#F0F9FF' : '#FFFFFF'
          }}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
            id="csv-input"
            disabled={loading}
          />
          <label htmlFor="csv-input" className="cursor-pointer block">
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#111827' }}>
              Drop CSV here
            </h3>
            <p style={{ color: '#6B7280' }} className="mb-4">
              or click to browse
            </p>
            <p style={{ color: '#9CA3AF' }} className="text-sm">
              CSV should have: name, vcpu, memory_gb, storage_gb, os, annual_cost_onprem
            </p>
          </label>
        </div>

        {/* Demo Scenario */}
        <div className="rounded-lg p-8" style={{ backgroundColor: '#F0F9FF', border: '2px solid #BFDBFE' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#1E40AF' }}>
            Quick Start Options
          </h3>
          <p style={{ color: '#374151' }} className="mb-6 text-sm">
            Choose how you want to get started with your migration analysis.
          </p>

          <div className="space-y-3">
            {/* Download Sample Button (100+ VMs) */}
            <button
              onClick={() => {
                const link = document.createElement('a')
                link.href = '/heavy-sample-vmware-inventory.csv'
                link.download = 'vmware-inventory-100vms.csv'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
              disabled={loading}
              className="w-full font-semibold py-3 rounded-lg transition border-2"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#2563EB',
                color: '#2563EB'
              }}
            >
              📄 Download Sample CSV (100+ VMs)
            </button>
            <p style={{ color: '#6B7280' }} className="text-xs">
              Enterprise-scale template with realistic infrastructure to customize with your own data
            </p>

            {/* Heavy Sample Button (120s Progress) */}
            <button
              onClick={loadHeavySampleCSV}
              disabled={loading}
              className="w-full font-bold py-3 rounded-lg transition text-white border-2"
              style={{
                backgroundColor: loading ? '#D1D5DB' : '#8B5CF6',
                borderColor: '#7C3AED',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Loading...' : '⏱️ Load Heavy Sample (100+ VMs)'}
            </button>
            <p style={{ color: '#6B7280' }} className="text-xs">
              Enterprise-scale with progress bar (90s assessment time)
            </p>

            {/* Large Demo Button */}
            <button
              onClick={() => onUpload(DEMO_DATA)}
              disabled={loading}
              className="w-full font-bold py-3 rounded-lg transition text-white"
              style={{
                backgroundColor: loading ? '#D1D5DB' : '#6366F1',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Loading...' : '📊 Load Full Demo (50 VMs)'}
            </button>
            <p style={{ color: '#6B7280' }} className="text-xs">
              Large enterprise scenario with all VM types included
            </p>
          </div>
        </div>
      </div>

      {/* CSV Template */}
      <div className="rounded-lg p-6" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#111827' }}>
          📋 CSV Template
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ color: '#374151' }}>
            <thead style={{ backgroundColor: '#F3F4F6' }}>
              <tr>
                <th className="px-4 py-2 text-left font-bold">name</th>
                <th className="px-4 py-2 text-left font-bold">vcpu</th>
                <th className="px-4 py-2 text-left font-bold">memory_gb</th>
                <th className="px-4 py-2 text-left font-bold">storage_gb</th>
                <th className="px-4 py-2 text-left font-bold">os</th>
                <th className="px-4 py-2 text-left font-bold">annual_cost_onprem</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderTop: '1px solid #E5E7EB' }}>
                <td className="px-4 py-3">prod-web-01</td>
                <td className="px-4 py-3">4</td>
                <td className="px-4 py-3">16</td>
                <td className="px-4 py-3">100</td>
                <td className="px-4 py-3">Windows Server 2019</td>
                <td className="px-4 py-3">5000</td>
              </tr>
              <tr style={{ borderTop: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                <td className="px-4 py-3">prod-db-01</td>
                <td className="px-4 py-3">8</td>
                <td className="px-4 py-3">32</td>
                <td className="px-4 py-3">500</td>
                <td className="px-4 py-3">Windows Server 2019</td>
                <td className="px-4 py-3">12000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ color: '#6B7280' }} className="text-xs mt-4">
          Download this template to fill in your own VM data. Annual cost should be in USD.
        </p>
      </div>
    </div>
  )
}
