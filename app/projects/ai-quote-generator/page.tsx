'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AIQuoteGeneratorPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'tech'>('overview')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F9FF' }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#0E7C86', borderBottom: '3px solid #006B76' }}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 mb-4 font-semibold transition"
            style={{ color: '#FFFFFF' }}
          >
            ← Back
          </button>
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3" style={{ color: '#FFFFFF' }}>
              <span>✨</span> AI-Powered Quote Generator
            </h1>
            <p className="text-lg mt-2" style={{ color: '#E0F7FF' }}>
              Generate unique quotes with Claude AI • Select themes • Save & export • Built with Claude API
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link
            href="/projects/ai-quote-generator/generator"
            className="rounded-lg p-6 hover:shadow-lg transition border-2"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#0E7C86', color: '#0E7C86' }}
          >
            <p className="text-sm mb-2">🚀 Open Generator</p>
            <p className="font-semibold" style={{ color: '#006B76' }}>Start Generating</p>
            <p className="text-xs mt-2" style={{ color: '#4A9FA5' }}>Interactive quote generator</p>
          </Link>

          <a
            href="https://github.com/saybabatunde/ai-quote-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-6 hover:shadow-lg transition border-2"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#0E7C86', color: '#0E7C86' }}
          >
            <p className="text-sm mb-2">📦 GitHub</p>
            <p className="font-semibold" style={{ color: '#006B76' }}>View Source</p>
            <p className="text-xs mt-2" style={{ color: '#4A9FA5' }}>Full code + documentation</p>
          </a>

          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: '#FFFFFF', borderColor: '#0E7C86', color: '#0E7C86' }}>
            <p className="text-sm mb-2">🤖 AI Engine</p>
            <p className="font-semibold" style={{ color: '#006B76' }}>Claude API</p>
            <p className="text-xs mt-2" style={{ color: '#10B981' }}>✓ AI-Generated Content</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8" style={{ borderBottom: '2px solid #0E7C86' }}>
          <div className="flex gap-4 overflow-x-auto">
            {(['overview', 'features', 'tech'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold border-b-2 transition`}
                style={{
                  color: activeTab === tab ? '#0E7C86' : '#4A9FA5',
                  borderBottomColor: activeTab === tab ? '#0E7C86' : 'transparent',
                }}
              >
                {tab === 'overview' && '📋 Overview'}
                {tab === 'features' && '✨ Features'}
                {tab === 'tech' && '🛠️ Tech Stack'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="rounded-lg p-8 border-2" style={{ backgroundColor: '#FFFFFF', borderColor: '#0E7C86' }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#006B76' }}>About This Project</h2>
                <p className="text-lg mb-4" style={{ color: '#1A5A63' }}>
                  An intelligent quote generator powered by Claude AI. Users select themes and receive uniquely generated quotes instantly, with options to save favorites and export as images.
                </p>
                <p className="mb-4" style={{ color: '#1A5A63' }}>
                  This project showcases integration with Claude API and demonstrates real-world AI application development with a polished, professional user interface.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg p-6 border-2" style={{ backgroundColor: '#F0F9FF', borderColor: '#0E7C86' }}>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#006B76' }}>🎯 Use Cases</h3>
                  <ul className="space-y-2" style={{ color: '#1A5A63' }}>
                    <li>✓ Daily inspiration</li>
                    <li>✓ Content creation</li>
                    <li>✓ Social media sharing</li>
                    <li>✓ Personal motivation</li>
                  </ul>
                </div>

                <div className="rounded-lg p-6 border-2" style={{ backgroundColor: '#F0F9FF', borderColor: '#0E7C86' }}>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#10B981' }}>💡 Key Capability</h3>
                  <ul className="space-y-2" style={{ color: '#1A5A63' }}>
                    <li>✓ AI-generated unique content</li>
                    <li>✓ Theme-based customization</li>
                    <li>✓ Save & organize favorites</li>
                    <li>✓ Export & share instantly</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg p-6 border-2" style={{ backgroundColor: '#E0F7FF', borderColor: '#0E7C86' }}>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#006B76' }}>🤖 Claude API Integration</h3>
                <p style={{ color: '#1A5A63' }}>
                  Demonstrates practical Claude API usage for content generation. Shows how to integrate AI language models into production applications with prompt engineering and real-time generation.
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
                    icon: '🎨',
                    title: 'AI Quote Generation',
                    desc: 'Claude AI generates unique, contextual quotes based on selected themes'
                  },
                  {
                    icon: '🏷️',
                    title: 'Theme Selection',
                    desc: 'Choose from multiple categories: Motivational, Business, Tech, Philosophy, and more'
                  },
                  {
                    icon: '❤️',
                    title: 'Save Favorites',
                    desc: 'Save your favorite quotes locally for quick access and inspiration'
                  },
                  {
                    icon: '🖼️',
                    title: 'Export as Images',
                    desc: 'Convert quotes into beautiful shareable images with custom styling'
                  },
                  {
                    icon: '📱',
                    title: 'Social Sharing',
                    desc: 'Share quotes directly to social media platforms with one click'
                  },
                  {
                    icon: '🌙',
                    title: 'Dark Mode UI',
                    desc: 'Beautiful dark interface for comfortable viewing anytime'
                  },
                  {
                    icon: '⚡',
                    title: 'Instant Generation',
                    desc: 'Get new quotes instantly without delays or rate limiting'
                  },
                  {
                    icon: '📱',
                    title: 'Responsive Design',
                    desc: 'Works seamlessly on desktop, tablet, and mobile devices'
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

          {/* Tech Stack Tab */}
          {activeTab === 'tech' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Technology Stack</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    category: 'Frontend',
                    tech: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS']
                  },
                  {
                    category: 'AI & APIs',
                    tech: ['Claude API', 'Prompt Engineering', 'Streaming', 'Error Handling']
                  },
                  {
                    category: 'Deployment',
                    tech: ['Vercel', 'Git/GitHub', 'Environment Variables', 'Production Optimization']
                  },
                ].map((stack, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-6 border border-gray-400">
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

              <div className="bg-purple-900/20 border border-gray-400 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-purple-300 mb-3">Why This Tech Stack?</h3>
                <ul className="space-y-2 text-gray-800">
                  <li>✓ <span className="font-semibold">Next.js:</span> Full-stack React with optimal performance</li>
                  <li>✓ <span className="font-semibold">TypeScript:</span> Type-safe code for reliability</li>
                  <li>✓ <span className="font-semibold">Claude API:</span> Powerful AI for content generation</li>
                  <li>✓ <span className="font-semibold">Tailwind CSS:</span> Fast, modern styling</li>
                  <li>✓ <span className="font-semibold">Vercel:</span> Seamless Next.js deployment</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* How to Use Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Use</h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Select a Theme',
                desc: 'Choose from available categories like Motivational, Business, Technology, or Philosophy'
              },
              {
                step: 2,
                title: 'Generate Quote',
                desc: 'Click the generate button and Claude AI creates a unique quote instantly'
              },
              {
                step: 3,
                title: 'Save or Share',
                desc: 'Save to favorites, export as image, or share directly to social media'
              },
              {
                step: 4,
                title: 'Repeat',
                desc: 'Generate as many unique quotes as you want with no limits'
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-400 rounded-lg p-6 flex gap-4">
                <div className="bg-gray-500 text-gray-800 w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-800 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-gradient-to-r from-gray-500 to-gray-400 rounded-lg p-8 text-center border border-gray-400">
          <h2 className="text-2xl font-bold text-white mb-4">Try AI Quote Generation</h2>
          <p className="text-white mb-6">
            Experience Claude-powered quote generation. No signup required.
          </p>
          <a
            href="/projects/ai-quote-generator/generator"
            className="inline-block bg-white text-gray-700 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Open Generator →
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-400 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-800">
          <p>&copy; 2024 AI-Powered Quote Generator. Built with Claude AI.</p>
        </div>
      </footer>
    </div>
  )
}
