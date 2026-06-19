'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CloudCostROICalculatorPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'calculator'>('overview')

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white flex items-center gap-2 mb-4"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <span>💰</span> Cloud Cost ROI Calculator
            </h1>
            <p className="text-gray-300 text-lg mt-2">
              Calculate return on investment for your cloud infrastructure • Built with Claude AI
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link
            href="/projects/cloud-cost-roi-calculator/calculator"
            className="bg-white border border-gray-400 rounded-lg p-6 hover:border-blue-500 transition"
          >
            <p className="text-gray-800 text-sm mb-2">🚀 Open Calculator</p>
            <p className="text-gray-800 font-semibold">Start Analysis</p>
            <p className="text-xs text-gray-500 mt-2">Interactive ROI calculator</p>
          </Link>

          <a
            href="https://github.com/saybabatunde/cloud-cost-roi-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-400 rounded-lg p-6 hover:border-green-500 transition"
          >
            <p className="text-gray-800 text-sm mb-2">📦 GitHub</p>
            <p className="text-gray-800 font-semibold">View Source</p>
            <p className="text-xs text-gray-500 mt-2">Full code + documentation</p>
          </a>

          <div className="bg-white border border-gray-400 rounded-lg p-6">
            <p className="text-gray-800 text-sm mb-2">⚡ Built With</p>
            <p className="text-gray-800 font-semibold">Claude AI</p>
            <p className="text-xs text-green-400 mt-2">✓ AI-Assisted Development</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-700">
          <div className="flex gap-4 overflow-x-auto">
            {(['overview', 'features', 'calculator'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold border-b-2 transition ${
                  activeTab === tab
                    ? 'text-white border-blue-500'
                    : 'text-gray-300 border-transparent hover:text-white'
                }`}
              >
                {tab === 'overview' && '📋 Overview'}
                {tab === 'features' && '✨ Features'}
                {tab === 'calculator' && '🧮 How It Works'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-gray-400 rounded-lg p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Project</h2>
                <p className="text-gray-800 text-lg mb-4">
                  A professional-grade ROI calculator built to help businesses and decision-makers understand the financial impact of cloud infrastructure investments.
                </p>
                <p className="text-gray-800 mb-4">
                  This project demonstrates AI-assisted development capabilities: built using Claude API and MCP servers for rapid, high-quality delivery.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-400">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">🎯 Problem Solved</h3>
                  <ul className="space-y-2 text-gray-800">
                    <li>✓ Hard to justify cloud investments</li>
                    <li>✓ Complex ROI calculations</li>
                    <li>✓ No clear cost visualization</li>
                    <li>✓ Difficult to compare scenarios</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-400">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">💡 Solution</h3>
                  <ul className="space-y-2 text-gray-800">
                    <li>✓ Easy-to-use calculator</li>
                    <li>✓ Automatic ROI computation</li>
                    <li>✓ Visual charts & graphs</li>
                    <li>✓ Export reports instantly</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-gray-400 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">🤖 AI-Assisted Development</h3>
                <p className="text-gray-800">
                  Built using Claude AI and MCP Servers for rapid prototyping. Demonstrates ability to leverage AI tools for faster, quality development while maintaining professional standards.
                </p>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Features</h2>

              <div className="space-y-4">
                {[
                  {
                    icon: '📊',
                    title: 'ROI Calculation',
                    desc: 'Automatically compute ROI based on infrastructure costs and business metrics'
                  },
                  {
                    icon: '📈',
                    title: 'Visual Analytics',
                    desc: 'Beautiful charts and graphs showing cost trends, ROI growth, and payback periods'
                  },
                  {
                    icon: '💾',
                    title: 'Export Reports',
                    desc: 'Download reports as PDF or CSV for presentations and documentation'
                  },
                  {
                    icon: '🔄',
                    title: 'Scenario Comparison',
                    desc: 'Compare multiple investment scenarios side-by-side to find optimal strategy'
                  },
                  {
                    icon: '📱',
                    title: 'Responsive Design',
                    desc: 'Works perfectly on desktop, tablet, and mobile devices'
                  },
                  {
                    icon: '🌙',
                    title: 'Dark Mode',
                    desc: 'Beautiful dark interface for comfortable viewing in any lighting'
                  },
                  {
                    icon: '⚡',
                    title: 'Real-Time Calculations',
                    desc: 'See results instantly as you adjust parameters'
                  },
                  {
                    icon: '💡',
                    title: 'Smart Insights',
                    desc: 'AI-powered recommendations based on your investment data'
                  },
                ].map((feature, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-6 border border-gray-400">
                    <div className="flex gap-4">
                      <div className="text-3xl">{feature.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                        <p className="text-gray-800 text-sm">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How It Works Tab */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h2>

              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: 'Input Infrastructure Costs',
                    desc: 'Enter your annual cloud infrastructure costs (compute, storage, networking, etc.)'
                  },
                  {
                    step: 2,
                    title: 'Add Business Metrics',
                    desc: 'Provide business impact metrics: revenue increase, cost savings, productivity gains'
                  },
                  {
                    step: 3,
                    title: 'Select Time Period',
                    desc: 'Choose analysis period (1-5 years) to see long-term ROI projections'
                  },
                  {
                    step: 4,
                    title: 'View Results',
                    desc: 'Get instant ROI calculation, payback period, and financial projections'
                  },
                  {
                    step: 5,
                    title: 'Analyze Charts',
                    desc: 'Visualize trends with interactive charts and graphs'
                  },
                  {
                    step: 6,
                    title: 'Export Report',
                    desc: 'Download professional report for presentations and stakeholder communication'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-6 border border-gray-400 flex gap-4">
                    <div className="bg-blue-600 text-gray-800 w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-800 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-900/20 border border-gray-400 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-green-300 mb-3">🚀 Ready to Calculate?</h3>
                <p className="text-gray-800 mb-4">
                  Visit the live calculator to analyze your cloud infrastructure ROI.
                </p>
                <a
                  href="/projects/cloud-cost-roi-calculator/calculator"
                  className="inline-block bg-green-600 hover:bg-green-700 text-gray-800 font-bold px-6 py-3 rounded-lg transition"
                >
                  Open Calculator →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Tech Stack Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                category: 'Frontend',
                tech: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS']
              },
              {
                category: 'Visualization',
                tech: ['Recharts', 'Chart.js', 'SVG', 'Responsive Design']
              },
              {
                category: 'Development',
                tech: ['Claude AI', 'MCP Servers', 'Vercel', 'Git/GitHub']
              },
            ].map((stack, idx) => (
              <div key={idx} className="bg-white border border-gray-400 rounded-lg p-6">
                <h3 className="font-semibold text-gray-700 mb-4">{stack.category}</h3>
                <ul className="space-y-2">
                  {stack.tech.map((tech, i) => (
                    <li key={i} className="text-gray-800 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-gradient-to-r from-gray-500 to-gray-400 rounded-lg p-8 text-center border border-gray-400">
          <h2 className="text-2xl font-bold text-white mb-4">Try It Out</h2>
          <p className="text-white mb-6">
            Experience the calculator firsthand. No signup required.
          </p>
          <a
            href="/projects/cloud-cost-roi-calculator/calculator"
            className="inline-block bg-white text-gray-700 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Open Calculator →
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-400 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-800">
          <p>&copy; 2024 Cloud Cost ROI Calculator. Built with Claude AI.</p>
        </div>
      </footer>
    </div>
  )
}
