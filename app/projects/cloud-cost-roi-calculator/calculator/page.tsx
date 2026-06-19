'use client'

import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { jsPDF } from 'jspdf'
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, TextRun, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'

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
    { name: 'Compute', value: monthlyCompute, fill: '#0369a1' },
    { name: 'Storage', value: monthlyStorage, fill: '#0ea5e9' },
    { name: 'Networking', value: monthlyNetworking, fill: '#06b6d4' },
    { name: 'Other', value: monthlyOther, fill: '#14b8a6' },
  ]

  const projectionData = Array.from({ length: years + 1 }, (_, i) => ({
    year: i,
    costs: annualInfraCost * i,
    benefits: annualBenefit * i,
    netProfit: (annualBenefit * i) - (annualInfraCost * i),
  }))

  const benefitBreakdown = [
    { name: 'Revenue Increase', value: revenueIncrease, fill: '#0ea5e9' },
    { name: 'Cost Savings', value: costSavings, fill: '#06b6d4' },
    { name: 'Productivity Gain', value: productivityGain, fill: '#14b8a6' },
  ]

  const reportData = {
    title: 'Cloud Infrastructure ROI Calculator Report',
    date: new Date().toLocaleString(),
    infrastructure: {
      compute: monthlyCompute,
      storage: monthlyStorage,
      networking: monthlyNetworking,
      other: monthlyOther,
      total: monthlyInfraCost,
      annual: annualInfraCost,
    },
    benefits: {
      revenue: revenueIncrease,
      savings: costSavings,
      productivity: productivityGain,
      total: monthlyBenefit,
      annual: annualBenefit,
    },
    projection: {
      years,
      totalCost,
      totalBenefit,
      netProfit,
      roi,
      paybackMonths,
    },
  }

  const handleExportText = () => {
    const text = `
CLOUD INFRASTRUCTURE ROI CALCULATOR REPORT
==========================================
Generated: ${reportData.date}

INFRASTRUCTURE COSTS (Monthly)
- Compute: $${reportData.infrastructure.compute.toLocaleString()}
- Storage: $${reportData.infrastructure.storage.toLocaleString()}
- Networking: $${reportData.infrastructure.networking.toLocaleString()}
- Other: $${reportData.infrastructure.other.toLocaleString()}
- TOTAL: $${reportData.infrastructure.total.toLocaleString()}

ANNUAL INFRASTRUCTURE COST: $${reportData.infrastructure.annual.toLocaleString()}

BUSINESS BENEFITS (Monthly)
- Revenue Increase: $${reportData.benefits.revenue.toLocaleString()}
- Cost Savings: $${reportData.benefits.savings.toLocaleString()}
- Productivity Gain: $${reportData.benefits.productivity.toLocaleString()}
- TOTAL: $${reportData.benefits.total.toLocaleString()}

ANNUAL BENEFITS: $${reportData.benefits.annual.toLocaleString()}

${reportData.projection.years}-YEAR PROJECTION
- Total Infrastructure Cost: $${reportData.projection.totalCost.toLocaleString()}
- Total Benefits: $${reportData.projection.totalBenefit.toLocaleString()}
- Net Profit: $${reportData.projection.netProfit.toLocaleString()}
- ROI: ${reportData.projection.roi}%
- Payback Period: ${reportData.projection.paybackMonths} months

CONCLUSION
A ${reportData.projection.roi}% ROI over ${reportData.projection.years} years demonstrates strong business value
from cloud infrastructure investment. Payback period of ${reportData.projection.paybackMonths} months
indicates rapid return on investment.
    `

    const blob = new Blob([text], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cloud-roi-report-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    let yPosition = 15

    pdf.setFontSize(18)
    pdf.text('Cloud Infrastructure ROI Calculator Report', pageWidth / 2, yPosition, { align: 'center' } as any)
    yPosition += 10

    pdf.setFontSize(10)
    pdf.text(`Generated: ${reportData.date}`, pageWidth / 2, yPosition, { align: 'center' } as any)
    yPosition += 12

    pdf.setFontSize(12)
    pdf.text('Infrastructure Costs (Monthly)', 15, yPosition)
    yPosition += 7
    pdf.setFontSize(10)
    pdf.text(`Compute: $${reportData.infrastructure.compute.toLocaleString()}`, 20, yPosition)
    yPosition += 5
    pdf.text(`Storage: $${reportData.infrastructure.storage.toLocaleString()}`, 20, yPosition)
    yPosition += 5
    pdf.text(`Networking: $${reportData.infrastructure.networking.toLocaleString()}`, 20, yPosition)
    yPosition += 5
    pdf.text(`Other: $${reportData.infrastructure.other.toLocaleString()}`, 20, yPosition)
    yPosition += 5
    pdf.setFont('Helvetica', 'bold')
    pdf.text(`Total: $${reportData.infrastructure.total.toLocaleString()}`, 20, yPosition)
    pdf.setFont('Helvetica', 'normal')
    yPosition += 8

    pdf.text(`Annual Infrastructure Cost: $${reportData.infrastructure.annual.toLocaleString()}`, 15, yPosition)
    yPosition += 12

    pdf.setFontSize(12)
    pdf.text('Business Benefits (Monthly)', 15, yPosition)
    yPosition += 7
    pdf.setFontSize(10)
    pdf.text(`Revenue Increase: $${reportData.benefits.revenue.toLocaleString()}`, 20, yPosition)
    yPosition += 5
    pdf.text(`Cost Savings: $${reportData.benefits.savings.toLocaleString()}`, 20, yPosition)
    yPosition += 5
    pdf.text(`Productivity Gain: $${reportData.benefits.productivity.toLocaleString()}`, 20, yPosition)
    yPosition += 5
    pdf.setFont('Helvetica', 'bold')
    pdf.text(`Total: $${reportData.benefits.total.toLocaleString()}`, 20, yPosition)
    pdf.setFont('Helvetica', 'normal')
    yPosition += 8

    pdf.text(`Annual Benefits: $${reportData.benefits.annual.toLocaleString()}`, 15, yPosition)
    yPosition += 12

    pdf.setFontSize(12)
    pdf.text(`${reportData.projection.years}-Year Projection`, 15, yPosition)
    yPosition += 7
    pdf.setFontSize(10)
    pdf.text(`Total Infrastructure Cost: $${reportData.projection.totalCost.toLocaleString()}`, 20, yPosition)
    yPosition += 5
    pdf.text(`Total Benefits: $${reportData.projection.totalBenefit.toLocaleString()}`, 20, yPosition)
    yPosition += 5
    pdf.setFont('Helvetica', 'bold' as any)
    pdf.text(`Net Profit: $${reportData.projection.netProfit.toLocaleString()}`, 20, yPosition)
    pdf.setFont('Helvetica', 'normal' as any)
    yPosition += 5
    pdf.text(`ROI: ${reportData.projection.roi}%`, 20, yPosition)
    yPosition += 5
    pdf.text(`Payback Period: ${reportData.projection.paybackMonths} months`, 20, yPosition)

    pdf.save(`cloud-roi-report-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const handleExportWord = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'Cloud Infrastructure ROI Calculator Report',
              heading: 'Heading1',
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `Generated: ${reportData.date}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: 'Infrastructure Costs (Monthly)',
              heading: 'Heading2',
              spacing: { before: 200, after: 200 },
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Category')] }),
                    new TableCell({ children: [new Paragraph('Amount')] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Compute')] }),
                    new TableCell({ children: [new Paragraph(`$${reportData.infrastructure.compute.toLocaleString()}`)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Storage')] }),
                    new TableCell({ children: [new Paragraph(`$${reportData.infrastructure.storage.toLocaleString()}`)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Networking')] }),
                    new TableCell({ children: [new Paragraph(`$${reportData.infrastructure.networking.toLocaleString()}`)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Other')] }),
                    new TableCell({ children: [new Paragraph(`$${reportData.infrastructure.other.toLocaleString()}`)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Total', bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `$${reportData.infrastructure.total.toLocaleString()}`, bold: true })] })] }),
                  ],
                }),
              ],
            }),
            new Paragraph({
              text: `Annual Infrastructure Cost: $${reportData.infrastructure.annual.toLocaleString()}`,
              spacing: { before: 200, after: 400 },
            }),
            new Paragraph({
              text: 'Business Benefits (Monthly)',
              heading: 'Heading2',
              spacing: { before: 200, after: 200 },
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Category')] }),
                    new TableCell({ children: [new Paragraph('Amount')] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Revenue Increase')] }),
                    new TableCell({ children: [new Paragraph(`$${reportData.benefits.revenue.toLocaleString()}`)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Cost Savings')] }),
                    new TableCell({ children: [new Paragraph(`$${reportData.benefits.savings.toLocaleString()}`)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Productivity Gain')] }),
                    new TableCell({ children: [new Paragraph(`$${reportData.benefits.productivity.toLocaleString()}`)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Total', bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `$${reportData.benefits.total.toLocaleString()}`, bold: true })] })] }),
                  ],
                }),
              ],
            }),
            new Paragraph({
              text: `Annual Benefits: $${reportData.benefits.annual.toLocaleString()}`,
              spacing: { before: 200, after: 400 },
            }),
            new Paragraph({
              text: `${reportData.projection.years}-Year Projection`,
              heading: 'Heading2',
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              text: `Total Infrastructure Cost: $${reportData.projection.totalCost.toLocaleString()}`,
            }),
            new Paragraph({
              text: `Total Benefits: $${reportData.projection.totalBenefit.toLocaleString()}`,
            }),
            new Paragraph({
              children: [new TextRun({ text: `Net Profit: $${reportData.projection.netProfit.toLocaleString()}`, bold: true })],
            }),
            new Paragraph({
              text: `ROI: ${reportData.projection.roi}%`,
            }),
            new Paragraph({
              text: `Payback Period: ${reportData.projection.paybackMonths} months`,
              spacing: { after: 400 },
            }),
          ],
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, `cloud-roi-report-${new Date().toISOString().split('T')[0]}.docx`)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-slate-900 shadow-lg sticky top-0 z-50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 font-semibold text-sm"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-white">💰 Cloud Cost ROI Calculator</h1>
          <p className="text-gray-300 mt-2">Calculate your cloud infrastructure return on investment with precision</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Infrastructure Costs */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-400">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500 to-gray-400 flex items-center justify-center text-gray-800 font-bold">1</div>
                <h2 className="text-xl font-bold text-gray-800">Infrastructure Costs</h2>
              </div>
              <p className="text-sm text-slate-500 mb-6">Monthly costs for cloud resources</p>
              <div className="space-y-5">
                {[
                  { label: 'Compute (VMs, etc)', value: monthlyCompute, setter: setMonthlyCompute, icon: '⚙️' },
                  { label: 'Storage', value: monthlyStorage, setter: setMonthlyStorage, icon: '💾' },
                  { label: 'Networking', value: monthlyNetworking, setter: setMonthlyNetworking, icon: '🌐' },
                  { label: 'Other', value: monthlyOther, setter: setMonthlyOther, icon: '📦' },
                ].map((item: { label: string; value: number; setter: (val: number) => void; icon: string }) => (
                  <div key={item.label}>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block flex items-center gap-2">
                      <span>{item.icon}</span> {item.label}
                    </label>
                    <div className="flex items-center gap-3 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-400 rounded-lg px-4 py-3">
                      <span className="text-slate-500 font-semibold">$</span>
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => item.setter(Number(e.target.value))}
                        className="flex-1 bg-transparent text-gray-800 font-semibold outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-400">
                <p className="text-sm text-gray-800 mb-2">Monthly Total</p>
                <p className="text-3xl font-bold text-gray-700">${monthlyInfraCost.toLocaleString()}</p>
              </div>
            </div>

            {/* Business Benefits */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-400">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500 to-gray-400 flex items-center justify-center text-gray-800 font-bold">2</div>
                <h2 className="text-xl font-bold text-gray-800">Business Benefits</h2>
              </div>
              <p className="text-sm text-slate-500 mb-6">Monthly value generated</p>
              <div className="space-y-5">
                {[
                  { label: 'Revenue Increase', value: revenueIncrease, setter: setRevenueIncrease, icon: '📈' },
                  { label: 'Cost Savings', value: costSavings, setter: setCostSavings, icon: '💚' },
                  { label: 'Productivity Gain', value: productivityGain, setter: setProductivityGain, icon: '⚡' },
                ].map((item: { label: string; value: number; setter: (val: number) => void; icon: string }) => (
                  <div key={item.label}>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block flex items-center gap-2">
                      <span>{item.icon}</span> {item.label}
                    </label>
                    <div className="flex items-center gap-3 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                      <span className="text-slate-500 font-semibold">$</span>
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => item.setter(Number(e.target.value))}
                        className="flex-1 bg-transparent text-gray-800 font-semibold outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-300">
                <p className="text-sm text-gray-800 mb-2">Monthly Total</p>
                <p className="text-3xl font-bold text-cyan-600">${monthlyBenefit.toLocaleString()}</p>
              </div>
            </div>

            {/* Analysis Period */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-400">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-600 to-blue-600 flex items-center justify-center text-gray-800 font-bold">3</div>
                <h2 className="text-xl font-bold text-gray-800">Analysis Period</h2>
              </div>
              <p className="text-sm text-slate-500 mb-6">Select timeframe for ROI analysis</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-800">Years: </span>
                <span className="text-3xl font-bold text-cyan-700">{years}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-3">
                <span>1 year</span>
                <span>5 years</span>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-800 mb-3">Export Format:</p>
              <button
                onClick={handleExportText}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-400 hover:from-blue-700 hover:to-sky-700 text-gray-800 font-bold py-3 rounded-lg transition shadow-lg flex items-center justify-center gap-2"
              >
                📄 Export as Text
              </button>
              <button
                onClick={handleExportPDF}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-gray-800 font-bold py-3 rounded-lg transition shadow-lg flex items-center justify-center gap-2"
              >
                📕 Export as PDF
              </button>
              <button
                onClick={handleExportWord}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-400 hover:from-cyan-700 hover:to-teal-700 text-gray-800 font-bold py-3 rounded-lg transition shadow-lg flex items-center justify-center gap-2"
              >
                📘 Export as Word
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-emerald-500">
                <p className="text-emerald-600 text-sm font-semibold mb-2">ROI</p>
                <p className="text-4xl font-bold text-gray-800">{roi}%</p>
                <p className="text-xs text-slate-500 mt-2">Return on investment</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-blue-500">
                <p className="text-gray-700 text-sm font-semibold mb-2">Payback Period</p>
                <p className="text-4xl font-bold text-gray-800">{paybackMonths}</p>
                <p className="text-xs text-slate-500 mt-2">months</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-sky-500">
                <p className="text-cyan-700 text-sm font-semibold mb-2">Net Profit</p>
                <p className="text-3xl font-bold text-gray-800">${netProfit.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-2">{years}-year total</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-cyan-500">
                <p className="text-cyan-600 text-sm font-semibold mb-2">Annual Benefit</p>
                <p className="text-3xl font-bold text-gray-800">${annualBenefit.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-2">per year</p>
              </div>
            </div>

            {/* Cost Breakdown Pie Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-400">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Monthly Cost Breakdown</h3>
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
                  <Tooltip formatter={(value) => `$${typeof value === 'number' ? value.toLocaleString() : value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* ROI Projection Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-400">
              <h3 className="text-lg font-bold text-gray-800 mb-6">{years}-Year ROI Projection</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                  <XAxis dataKey="year" stroke="#64748b" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f8fafc', border: '2px solid #0ea5e9', borderRadius: '8px' }}
                    formatter={(value) => `$${typeof value === 'number' ? value.toLocaleString() : value}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="benefits" stroke="#0ea5e9" strokeWidth={3} name="Cumulative Benefits" dot={{ fill: '#0ea5e9', r: 5 }} />
                  <Line type="monotone" dataKey="costs" stroke="#ef4444" strokeWidth={3} name="Infrastructure Costs" dot={{ fill: '#ef4444', r: 5 }} />
                  <Line type="monotone" dataKey="netProfit" stroke="#10b981" strokeWidth={3} name="Net Profit" dot={{ fill: '#10b981', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Benefit Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-400">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Monthly Benefit Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={benefitBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f8fafc', border: '2px solid #0ea5e9', borderRadius: '8px' }}
                    formatter={(value) => `$${typeof value === 'number' ? value.toLocaleString() : value}`}
                  />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
