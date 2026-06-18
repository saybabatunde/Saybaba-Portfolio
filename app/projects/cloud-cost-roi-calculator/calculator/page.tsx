'use client'

import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function CalculatorPage() {
  // Infrastructure Costs
  const [monthlyCompute, setMonthlyCompute] = useState(5000)
  const [monthlyStorage, setMonthlyStorage] = useState(1500)
  const [monthlyNetworking, setMonthlyNetworking] = useState(800)
  const [monthlyOther, setMonthlyOther] = useState(700)

  // Business Metrics
  const [revenueIncrease, setRevenueIncrease] = useState(50000)
  const [costSavings, setCostSavings] = useState(10000)
  const [productivityGain, setProductivityGain] = useState(5000)

  // Time Period
  const [years, setYears] = useState(3)

  // Calculate ROI
  const monthlyInfraCost = monthlyCompute + monthlyStorage + monthlyNetworking + monthlyOther
  const annualInfraCost = monthlyInfraCost * 12
  const monthlyBenefit = revenueIncrease + costSavings + productivityGain
  const annualBenefit = monthlyBenefit * 12
  const totalCost = annualInfraCost * years
  const totalBenefit = annualBenefit * years
  const netProfit = totalBenefit - totalCost
  const roi = totalCost > 0 ? ((netProfit / totalCost) * 100).toFixed(2) : 0
  const paybackMonths = monthlyBenefit > 0 ? Math.ceil(annualInfraCost / monthlyBenefit) : 0

  // Charts Data
  const costBreakdown = [
    { name: 'Compute', value: monthlyCompute, fill: '#3b82f6' },
    { name: 'Storage', value: monthlyStorage, fill: '#10b981' },
    { name: 'Networking', value: monthlyNetworking, fill: '#f59e0b' },
    { name: 'Other', value: monthlyOther, fill: '#8b5cf6' },
  ]

  const projectionData = Array.from({ length: years + 1 }, (_, i) => ({
    year: i,
    costs: annualInfraCost * i,
    benefits: annualBenefit * i,
    netProfit: (annualBenefit * i) - (annualInfraCost * i),
  }))

  const benefitBreakdown = [
    { name: 'Revenue Increase', value: revenueIncrease, fill: '#10b981' },
    { name: 'Cost Savings', value: costSavings, fill: '#3b82f6' },
    { name: 'Productivity Gain', value: productivityGain, fill: '#f59e0b' },
  ]

  const handleExport = () => {
    const reportData = `
CLOUD INFRASTRUCTURE ROI CALCULATOR REPORT
==========================================
Generated: ${new Date().toLocaleString()}

INFRASTRUCTURE COSTS (Monthly)
- Compute: $${monthlyCompute.toLocaleString()}
- Storage: $${monthlyStorage.toLocaleString()}
- Networking: $${monthlyNetworking.toLocaleString()}
- Other: $${monthlyOther.toLocaleString()}
- TOTAL: $${monthlyInfraCost.toLocaleString()}

ANNUAL INFRASTRUCTURE COST: $${annualInfraCost.toLocaleString()}

BUSINESS BENEFITS (Monthly)
- Revenue Increase: $${revenueIncrease.toLocaleString()}
- Cost Savings: $${costSavings.toLocaleString()}
- Productivity Gain: $${productivityGain.toLocaleString()}
- TOTAL: $${monthlyBenefit.toLocaleString()}

ANNUAL BENEFITS: $${annualBenefit.toLocaleString()}

${years}-YEAR PROJECTION
- Total Infrastructure Cost: $${totalCost.toLocaleString()}
- Total Benefits: $${totalBenefit.toLocaleString()}
- Net Profit: $${netProfit.toLocaleString()}
- ROI: ${roi}%
- Payback Period: ${paybackMonths} months

CONCLUSION
A ${roi}% ROI over ${years} years demonstrates strong business value
from cloud infrastructure investment. Payback period of ${paybackMonths} months
indicates rapid return on investment.
    `

    const blob = new Blob([reportData], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cloud-roi-report-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => window.history.back()}
            className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white">💰 Cloud Cost ROI Calculator</h1>
          <p className="text-gray-400">Calculate your cloud infrastructure return on investment</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Infrastructure Costs */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Infrastructure Costs (Monthly)</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm font-semibold mb-2 block">Compute (VMs, etc)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">$</span>
                    <input
                      type="number"
                      value={monthlyCompute}
                      onChange={(e) => setMonthlyCompute(Number(e.target.value))}
                      className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-semibold mb-2 block">Storage</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">$</span>
                    <input
                      type="number"
                      value={monthlyStorage}
                      onChange={(e) => setMonthlyStorage(Number(e.target.value))}
                      className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-semibold mb-2 block">Networking</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">$</span>
                    <input
                      type="number"
                      value={monthlyNetworking}
                      onChange={(e) => setMonthlyNetworking(Number(e.target.value))}
                      className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-semibold mb-2 block">Other</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">$</span>
                    <input
                      type="number"
                      value={monthlyOther}
                      onChange={(e) => setMonthlyOther(Number(e.target.value))}
                      className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Benefits */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Business Benefits (Monthly)</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm font-semibold mb-2 block">Revenue Increase</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">$</span>
                    <input
                      type="number"
                      value={revenueIncrease}
                      onChange={(e) => setRevenueIncrease(Number(e.target.value))}
                      className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-semibold mb-2 block">Cost Savings</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">$</span>
                    <input
                      type="number"
                      value={costSavings}
                      onChange={(e) => setCostSavings(Number(e.target.value))}
                      className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-semibold mb-2 block">Productivity Gain</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">$</span>
                    <input
                      type="number"
                      value={productivityGain}
                      onChange={(e) => setProductivityGain(Number(e.target.value))}
                      className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Period */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Analysis Period</h2>
              <div>
                <label className="text-gray-300 text-sm font-semibold mb-2 block">Years: {years}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
            >
              📥 Export Report
            </button>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-900/30 border border-green-600 rounded-lg p-6">
                <p className="text-green-400 text-sm font-semibold mb-2">ROI</p>
                <p className="text-4xl font-bold text-green-300">{roi}%</p>
              </div>
              <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-6">
                <p className="text-blue-400 text-sm font-semibold mb-2">Payback Period</p>
                <p className="text-4xl font-bold text-blue-300">{paybackMonths}</p>
                <p className="text-blue-400 text-xs">months</p>
              </div>
              <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-6">
                <p className="text-purple-400 text-sm font-semibold mb-2">Net Profit</p>
                <p className="text-2xl font-bold text-purple-300">${netProfit.toLocaleString()}</p>
                <p className="text-purple-400 text-xs">{years} years</p>
              </div>
              <div className="bg-orange-900/30 border border-orange-600 rounded-lg p-6">
                <p className="text-orange-400 text-sm font-semibold mb-2">Annual Benefit</p>
                <p className="text-2xl font-bold text-orange-300">${annualBenefit.toLocaleString()}</p>
              </div>
            </div>

            {/* Cost Breakdown Pie Chart */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Monthly Cost Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* ROI Projection Chart */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">{years}-Year ROI Projection</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="year" stroke="#888" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #444' }}
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="benefits" stroke="#10b981" strokeWidth={2} name="Cumulative Benefits" />
                  <Line type="monotone" dataKey="costs" stroke="#ef4444" strokeWidth={2} name="Infrastructure Costs" />
                  <Line type="monotone" dataKey="netProfit" stroke="#3b82f6" strokeWidth={2} name="Net Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Benefit Breakdown */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Monthly Benefit Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={benefitBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #444' }}
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
