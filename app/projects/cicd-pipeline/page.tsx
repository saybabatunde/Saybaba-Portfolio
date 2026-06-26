'use client'

import { useState } from 'react'

export default function CICDPipelinePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'features' | 'tech'>('overview')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A3A52' }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#8B9FD9', borderBottom: '2px solid #6B87D0' }}>
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
              <span>🔄</span> CI/CD Pipeline on Azure Kubernetes
            </h1>
            <p className="text-lg mt-2" style={{ color: '#E8EDFF' }}>
              Production-ready DevOps project: GitHub Actions → ACR → AKS → Azure Monitor
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <a
            href="https://github.com/saybabatunde/azure-k8s-cicd-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-6 hover:shadow-lg transition border-2"
            style={{ backgroundColor: '#2D5A6F', borderColor: '#4A7BA7', color: '#E8EDFF' }}
          >
            <p className="text-sm mb-2">📦 GitHub Repository</p>
            <p className="font-semibold" style={{ color: '#FFFFFF' }}>azure-k8s-cicd-demo</p>
            <p className="text-xs mt-2" style={{ color: '#B0C4DE' }}>View full source code</p>
          </a>

          <a
            href="https://github.com/saybabatunde/azure-k8s-cicd-demo/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-6 hover:shadow-lg transition border-2"
            style={{ backgroundColor: '#2D5A6F', borderColor: '#4A7BA7', color: '#E8EDFF' }}
          >
            <p className="text-sm mb-2">⚡ GitHub Actions</p>
            <p className="font-semibold" style={{ color: '#FFFFFF' }}>CI/CD Workflows</p>
            <p className="text-xs mt-2" style={{ color: '#B0C4DE' }}>Watch builds in real-time</p>
          </a>

          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: '#2D5A6F', borderColor: '#4A7BA7', color: '#E8EDFF' }}>
            <p className="text-sm mb-2">🎯 Project Status</p>
            <p className="font-semibold" style={{ color: '#FFFFFF' }}>5 Phases Complete</p>
            <p className="text-xs mt-2" style={{ color: '#7FFF7F' }}>✓ Production Ready</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8" style={{ borderBottom: '2px solid #4A7BA7' }}>
          <div className="flex gap-4 overflow-x-auto">
            {(['overview', 'architecture', 'features', 'tech'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold border-b-2 transition ${
                  activeTab === tab
                    ? 'border-b-2'
                    : 'border-transparent hover:text-white'
                }`}
                style={{
                  color: activeTab === tab ? '#FFFFFF' : '#B0C4DE',
                  borderBottomColor: activeTab === tab ? '#8B9FD9' : 'transparent',
                }}
              >
                {tab === 'overview' && '📋 Overview'}
                {tab === 'architecture' && '🏗️ Architecture'}
                {tab === 'features' && '✨ Features'}
                {tab === 'tech' && '🛠️ Tech Stack'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="rounded-lg p-8 border-2" style={{ backgroundColor: '#2D5A6F', borderColor: '#4A7BA7' }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#FFFFFF' }}>Project Overview</h2>
                <p className="text-lg mb-4" style={{ color: '#E8EDFF' }}>
                  A complete, production-ready CI/CD pipeline demonstrating modern DevOps practices and cloud-native architecture on Azure.
                </p>
                <p className="mb-4" style={{ color: '#E8EDFF' }}>
                  This project showcases the entire DevOps lifecycle: from code commit through automated testing, containerization, infrastructure provisioning, Kubernetes orchestration, and observability.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg p-6 border-2" style={{ backgroundColor: '#1A3A52', borderColor: '#4A7BA7' }}>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#B0C4DE' }}>🎯 What It Demonstrates</h3>
                  <ul className="space-y-2" style={{ color: '#E8EDFF' }}>
                    <li>✓ CI/CD Pipeline automation</li>
                    <li>✓ Infrastructure as Code (Terraform)</li>
                    <li>✓ Container orchestration (Kubernetes)</li>
                    <li>✓ Cloud-native architecture</li>
                    <li>✓ Monitoring & observability</li>
                    <li>✓ DevOps best practices</li>
                  </ul>
                </div>

                <div className="rounded-lg p-6 border-2" style={{ backgroundColor: '#1A3A52', borderColor: '#4A7BA7' }}>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#7FFF7F' }}>🚀 Key Capabilities</h3>
                  <ul className="space-y-2" style={{ color: '#E8EDFF' }}>
                    <li>✓ Automated code quality checks</li>
                    <li>✓ Multi-stage Docker builds</li>
                    <li>✓ Automatic deployment to K8s</li>
                    <li>✓ Rolling updates (zero downtime)</li>
                    <li>✓ Real-time monitoring & alerts</li>
                    <li>✓ Production-grade security</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg p-6 border-2" style={{ backgroundColor: '#1A3A52', borderColor: '#4A7BA7' }}>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#B0C4DE' }}>💡 Why This Project</h3>
                <p style={{ color: '#E8EDFF' }}>
                  This project is one of the strongest portfolio pieces for cloud engineering roles because it demonstrates that you can actually build and deploy production systems, not just talk about them. It shows real-world skills that companies need.
                </p>
              </div>
            </div>
          )}

          {/* Architecture Tab */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">System Architecture</h2>

              <div className="bg-gray-700/40 rounded-lg p-6 border border-gray-600 font-mono text-sm">
                <pre className="text-white overflow-x-auto">
{`┌──────────────────────────────────────────────────────┐
│                  Git Repository                      │
│              (azure-k8s-cicd-demo)                   │
└──────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│           GitHub Actions CI/CD Pipeline              │
│                                                      │
│  1. Lint (flake8)  2. Test (pytest)                 │
│  3. Build Docker   4. Push to ACR                   │
└──────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│      Azure Container Registry (ACR)                 │
│         (Docker Image Repository)                   │
└──────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│    Azure Kubernetes Service (AKS)                   │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  LoadBalancer Service (Public IP)            │  │
│  │  ↓                                             │  │
│  │  Deployment (2 replicas)                     │  │
│  │  ├─ Pod 1 (Flask App + Health Checks)       │  │
│  │  └─ Pod 2 (Flask App + Health Checks)       │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│      Azure Monitor & Application Insights           │
│                                                      │
│  ✓ Real-time Metrics                               │
│  ✓ Alert Rules (Response Time, Errors, Uptime)    │
│  ✓ Email Notifications                             │
│  ✓ Dashboard & Diagnostics                         │
└──────────────────────────────────────────────────────┘`}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700/40 rounded-lg p-6 border border-gray-600">
                  <h3 className="font-semibold text-white mb-3">Infrastructure</h3>
                  <ul className="space-y-2 text-white text-sm">
                    <li>• Virtual Network (10.0.0.0/16)</li>
                    <li>• AKS Cluster (managed Kubernetes)</li>
                    <li>• Container Registry (image storage)</li>
                    <li>• Log Analytics (diagnostics)</li>
                  </ul>
                </div>

                <div className="bg-gray-700/40 rounded-lg p-6 border border-gray-600">
                  <h3 className="font-semibold text-white mb-3">Deployment</h3>
                  <ul className="space-y-2 text-white text-sm">
                    <li>• 2 replicas (high availability)</li>
                    <li>• Rolling update strategy</li>
                    <li>• Liveness/Readiness probes</li>
                    <li>• Resource limits (CPU, memory)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Project Features</h2>

              <div className="space-y-4">
                {[
                  {
                    icon: '⚙️',
                    title: 'Automated CI/CD Pipeline',
                    desc: 'GitHub Actions triggers on code push: lint → test → build → deploy',
                  },
                  {
                    icon: '📦',
                    title: 'Infrastructure as Code',
                    desc: 'Terraform provisions entire AKS stack: cluster, registry, networking, monitoring',
                  },
                  {
                    icon: '🐳',
                    title: 'Docker Containerization',
                    desc: 'Multi-stage builds for optimized images, pushed to Azure Container Registry',
                  },
                  {
                    icon: '☸️',
                    title: 'Kubernetes Orchestration',
                    desc: 'Zero-downtime rolling updates, health checks, auto-scaling, resource management',
                  },
                  {
                    icon: '📊',
                    title: 'Production Monitoring',
                    desc: 'Application Insights, alerts on response time/errors/availability, dashboards',
                  },
                  {
                    icon: '🔒',
                    title: 'Security Hardened',
                    desc: 'Non-root containers, RBAC, network policies, secret management best practices',
                  },
                  {
                    icon: '✅',
                    title: 'Code Quality Gates',
                    desc: 'Automated linting with Flake8, unit tests with Pytest, code coverage reporting',
                  },
                  {
                    icon: '📈',
                    title: 'Auto-Scaling',
                    desc: 'Cluster scales 1-5 nodes based on demand, cost-optimized for development',
                  },
                ].map((feature, idx) => (
                  <div key={idx} className="bg-gray-700/40 rounded-lg p-6 border border-gray-600">
                    <div className="flex gap-4">
                      <div className="text-3xl">{feature.icon}</div>
                      <div>
                        <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-white text-sm">{feature.desc}</p>
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
              <h2 className="text-2xl font-bold text-white mb-6">Technology Stack</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    category: 'Application',
                    tech: ['Python', 'Flask', 'Gunicorn', 'pytest', 'flake8'],
                  },
                  {
                    category: 'Containerization',
                    tech: ['Docker', 'Docker Buildx', 'Multi-stage builds', 'ACR'],
                  },
                  {
                    category: 'CI/CD',
                    tech: ['GitHub Actions', 'Git', 'Workflow automation', 'Status checks'],
                  },
                  {
                    category: 'Orchestration',
                    tech: ['Kubernetes (K8s)', 'Azure AKS', 'Helm (optional)', 'kubectl'],
                  },
                  {
                    category: 'Infrastructure',
                    tech: ['Terraform', 'Azure VNet', 'Azure Load Balancer', 'RBAC'],
                  },
                  {
                    category: 'Monitoring',
                    tech: ['Application Insights', 'Azure Monitor', 'Log Analytics', 'Alerts'],
                  },
                ].map((stack, idx) => (
                  <div key={idx} className="bg-gray-700/40 rounded-lg p-6 border border-gray-600">
                    <h3 className="font-semibold text-gray-300 mb-4">{stack.category}</h3>
                    <ul className="space-y-2">
                      {stack.tech.map((tech, i) => (
                        <li key={i} className="text-white flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Project Phases */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Project Phases (5 Complete)</h2>
          <div className="space-y-3">
            {[
              { phase: 1, title: 'Flask App + Docker', status: '✓ Complete' },
              { phase: 2, title: 'GitHub Actions CI/CD Pipeline', status: '✓ Complete' },
              { phase: 3, title: 'Terraform Infrastructure (AKS, ACR)', status: '✓ Complete' },
              { phase: 4, title: 'Kubernetes Manifests & Auto-Deploy', status: '✓ Complete' },
              { phase: 5, title: 'Azure Monitor & Observability', status: '✓ Complete' },
            ].map((p, idx) => (
              <div key={idx} className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {p.phase}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{p.title}</p>
                  </div>
                </div>
                <p className="text-green-400 font-semibold">{p.status}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-8 text-center border border-gray-600">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Deploy?</h2>
          <p className="text-gray-300 mb-6">
            This project is production-ready and demonstrates full-stack DevOps capabilities.
          </p>
          <a
            href="https://github.com/saybabatunde/azure-k8s-cicd-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold px-8 py-3 rounded-lg transition border border-gray-600"
          >
            View on GitHub →
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/50 border-t border-gray-600 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-white">
          <p>&copy; 2024 Saybaba CI/CD Portfolio Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
