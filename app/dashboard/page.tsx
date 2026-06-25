'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProjectCard from '@/components/ProjectCard'
import { projects, type Project } from '@/lib/projects'

export default function DashboardPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const logged_in = localStorage.getItem('logged_in')
    const user = localStorage.getItem('username')

    if (!logged_in || !user) {
      router.push('/')
      return
    }

    setUsername(user)
    setIsAuthenticated(true)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('logged_in')
    localStorage.removeItem('username')
    router.push('/')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  // Group projects by category
  const categories = Array.from(new Set(projects.map((p) => p.category)))

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#6B6256' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-lg" style={{ backgroundColor: '#8A7E73' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">Saybaba Portfolio</h1>
            <p className="text-white text-sm opacity-90">Welcome, {username}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white font-semibold py-2 px-6 rounded-lg transition duration-200 border-2 border-white hover:bg-white hover:text-gray-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Intro Section */}
        <div className="mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-white mb-4">My Portfolio</h2>
          <p className="text-white text-lg max-w-2xl opacity-95">
            Explore my projects across cloud platforms (AWS, Azure), Python development, and full-stack applications. Each project showcases my expertise in infrastructure, automation, and software development.
          </p>
        </div>

        {/* Live Projects / Interactive Demos */}
        <section className="mb-16 animate-fade-in">
          <h3 className="text-2xl font-bold text-white mb-8 pb-4" style={{ borderBottom: '2px solid #D4A17A' }}>
            🔴 Live Projects (Interactive Demos)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AWS User Onboarding Portal */}
            <Link href="/dashboard/onboarding">
              <div className="rounded-lg border-2 transition duration-300 p-6 cursor-pointer group hover:shadow-lg" style={{ backgroundColor: '#E8DCC8', borderColor: '#D4A17A', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">⚙️</span>
                  <div>
                    <h4 className="text-xl font-bold group-hover:text-gray-900" style={{ color: '#000000' }}>AWS User Onboarding</h4>
                    <p className="text-sm font-semibold" style={{ color: '#000000' }}>Live Demo with Real AWS Integration</p>
                  </div>
                </div>
                <p className="mb-4 font-medium" style={{ color: '#000000' }}>
                  Create real IAM users with a single click. See real AWS API calls, audit logs, and infrastructure in action. Built with Lambda, API Gateway, and DynamoDB.
                </p>
                <div className="flex items-center gap-2 font-bold group-hover:gap-3" style={{ color: '#D4A17A' }}>
                  Open Demo <span>→</span>
                </div>
              </div>
            </Link>

            {/* Azure User Onboarding Portal */}
            <Link href="/projects/azure-onboarding">
              <div className="rounded-lg border-2 transition duration-300 p-6 cursor-pointer group hover:shadow-lg" style={{ backgroundColor: '#E8DCC8', borderColor: '#D4A17A', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">☁️</span>
                  <div>
                    <h4 className="text-xl font-bold group-hover:text-gray-700" style={{ color: '#6B6256' }}>Azure User Onboarding</h4>
                    <p className="text-sm font-semibold" style={{ color: '#8A7E73' }}>Live Demo on Azure Static Web Apps</p>
                  </div>
                </div>
                <p className="mb-4 font-medium" style={{ color: '#000000' }}>
                  Experience Azure cloud deployment. Frontend hosted on Azure Static Web Apps with serverless architecture. See multi-cloud infrastructure in action.
                </p>
                <div className="flex items-center gap-2 font-bold group-hover:gap-3" style={{ color: '#D4A17A' }}>
                  Open Demo <span>→</span>
                </div>
              </div>
            </Link>

            {/* Multi-Cloud Identity & Infrastructure Automation Hub */}
            <Link href="/multicloud-hub">
              <div className="rounded-lg border-2 transition duration-300 p-6 cursor-pointer group hover:shadow-lg" style={{ backgroundColor: '#E8DCC8', borderColor: '#D4A17A', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🌐</span>
                  <div>
                    <h4 className="text-xl font-bold group-hover:text-gray-700" style={{ color: '#6B6256' }}>Multi-Cloud IAM Hub</h4>
                    <p className="text-sm font-semibold" style={{ color: '#8A7E73' }}>Identity & Infrastructure Automation</p>
                  </div>
                </div>
                <p className="mb-4 font-medium" style={{ color: '#000000' }}>
                  Enterprise IAM automation dashboard with onboarding workflows, role mapping matrix, provisioning simulation, and multi-cloud compliance tracking. Azure + AWS + Vercel.
                </p>
                <div className="flex items-center gap-2 font-bold group-hover:gap-3" style={{ color: '#D4A17A' }}>
                  Open Dashboard <span>→</span>
                </div>
              </div>
            </Link>

            {/* Infrastructure Health Dashboard */}
            <Link href="/dashboard/monitoring">
              <div className="rounded-lg border-2 transition duration-300 p-6 cursor-pointer group hover:shadow-lg" style={{ backgroundColor: '#E8DCC8', borderColor: '#D4A17A', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📊</span>
                  <div>
                    <h4 className="text-xl font-bold group-hover:text-gray-700" style={{ color: '#6B6256' }}>Infrastructure Health Dashboard</h4>
                    <p className="text-sm font-semibold" style={{ color: '#8A7E73' }}>Real-Time Cloud Monitoring</p>
                  </div>
                </div>
                <p className="mb-4 font-medium" style={{ color: '#000000' }}>
                  Monitor all connected services in real-time. Track GitHub, Supabase, Vercel, Resend, AWS, and Azure health. View CPU/RAM metrics and uptime percentages.
                </p>
                <div className="flex items-center gap-2 font-bold group-hover:gap-3" style={{ color: '#D4A17A' }}>
                  Open Dashboard <span>→</span>
                </div>
              </div>
            </Link>

            {/* Infrastructure Request Portal */}
            <Link href="/infrastructure-portal">
              <div className="rounded-lg border-2 transition duration-300 p-6 cursor-pointer group hover:shadow-lg" style={{ backgroundColor: '#E8DCC8', borderColor: '#D4A17A', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🏗️</span>
                  <div>
                    <h4 className="text-xl font-bold group-hover:text-gray-700" style={{ color: '#6B6256' }}>Infrastructure Request Portal</h4>
                    <p className="text-sm font-semibold" style={{ color: '#8A7E73' }}>Azure Provisioning Tool</p>
                  </div>
                </div>
                <p className="mb-4 font-medium" style={{ color: '#000000' }}>
                  Request and provision Azure infrastructure on-demand. Select VM size, region, and compliance level. Automated deployment via Terraform with cost controls and budget alerts.
                </p>
                <div className="flex items-center gap-2 font-bold group-hover:gap-3" style={{ color: '#D4A17A' }}>
                  Request Infrastructure <span>→</span>
                </div>
              </div>
            </Link>

            {/* CI/CD Pipeline Project */}
            <Link href="/projects/cicd-pipeline">
              <div className="rounded-lg border-2 transition duration-300 p-6 cursor-pointer group hover:shadow-lg" style={{ backgroundColor: '#E8DCC8', borderColor: '#D4A17A', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🔄</span>
                  <div>
                    <h4 className="text-xl font-bold group-hover:text-gray-700" style={{ color: '#6B6256' }}>CI/CD Pipeline on Kubernetes</h4>
                    <p className="text-sm font-semibold" style={{ color: '#8A7E73' }}>Production DevOps Project</p>
                  </div>
                </div>
                <p className="mb-4 font-medium" style={{ color: '#000000' }}>
                  Complete DevOps pipeline from code to production. GitHub Actions → Docker → Azure ACR → Kubernetes (AKS) → Azure Monitor. 5 phases of production-ready infrastructure.
                </p>
                <div className="flex items-center gap-2 font-bold group-hover:gap-3" style={{ color: '#D4A17A' }}>
                  View Project <span>→</span>
                </div>
              </div>
            </Link>
          </div>
          <p className="text-sm text-white mt-4" style={{ color: '#D4A17A' }}>
            💡 <span className="font-semibold">Live Projects:</span> All demos are fully functional with real integrations. Explore interactive dashboards and production DevOps pipeline.
          </p>
        </section>

        {/* AI-Assisted Development Projects */}
        <section className="mb-16 animate-fade-in">
          <h3 className="text-2xl font-bold text-white mb-8 pb-4" style={{ borderBottom: '2px solid #D4A17A' }}>
            🤖 AI-Assisted Development Projects (Claude Build)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cloud Cost ROI Calculator */}
            <Link href="/projects/cloud-cost-roi-calculator">
              <div className="rounded-lg border-2 transition duration-300 p-6 cursor-pointer group hover:shadow-lg" style={{ backgroundColor: '#E8DCC8', borderColor: '#D4A17A', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">💰</span>
                  <div>
                    <h4 className="text-xl font-bold group-hover:text-gray-700" style={{ color: '#6B6256' }}>Cloud Cost ROI Calculator</h4>
                    <p className="text-sm font-semibold" style={{ color: '#8A7E73' }}>AI-Assisted Development</p>
                  </div>
                </div>
                <p className="mb-4" style={{ color: '#6B6256' }}>
                  Calculate return on investment for cloud infrastructure deployments. Input costs and metrics, get instant ROI analysis with visual charts and exportable reports.
                </p>
                <div className="flex items-center gap-2 font-semibold group-hover:gap-3" style={{ color: '#D4A17A' }}>
                  View Project <span>→</span>
                </div>
              </div>
            </Link>

            {/* AI-Powered Quote Generator */}
            <Link href="/projects/ai-quote-generator">
              <div className="rounded-lg border-2 transition duration-300 p-6 cursor-pointer group hover:shadow-lg" style={{ backgroundColor: '#E8DCC8', borderColor: '#D4A17A', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">✨</span>
                  <div>
                    <h4 className="text-xl font-bold group-hover:text-gray-700" style={{ color: '#6B6256' }}>AI-Powered Quote Generator</h4>
                    <p className="text-sm font-semibold" style={{ color: '#8A7E73' }}>AI-Assisted Development</p>
                  </div>
                </div>
                <p className="mb-4" style={{ color: '#6B6256' }}>
                  Generate unique quotes powered by Claude AI. Select themes, save favorites, export as images, and share on social media. Built with Next.js and Claude API.
                </p>
                <div className="flex items-center gap-2 font-semibold group-hover:gap-3" style={{ color: '#D4A17A' }}>
                  View Project <span>→</span>
                </div>
              </div>
            </Link>
          </div>
          <p className="text-sm text-white mt-4" style={{ color: '#D4A17A' }}>
            ✨ <span className="font-semibold">AI-Built:</span> Showcasing rapid development with Claude AI and MCP servers. These projects demonstrate modern AI-assisted development practices.
          </p>
        </section>

        {/* Project Sections */}
        <div className="space-y-16">
          {categories.map((category) => {
            const categoryProjects = projects.filter((p) => p.category === category)
            return (
              <section key={category} className="animate-fade-in">
                <h3 className="text-2xl font-bold text-white mb-8 pb-4" style={{ borderBottom: '2px solid #D4A17A' }}>
                  {category} Projects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {categoryProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        {/* Call to Action */}
        <section className="mt-20 text-center py-12 rounded-lg border-2" style={{ backgroundColor: '#8A7E73', borderColor: '#D4A17A' }}>
          <h3 className="text-2xl font-bold text-white mb-4">
            Want to learn more?
          </h3>
          <p className="text-white mb-6 opacity-95">
            Check out my GitHub, LinkedIn, or contact me directly for collaboration opportunities.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/saybabatunde"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold py-2 px-6 rounded-lg transition duration-200 border-2 border-white hover:bg-white hover:text-gray-700"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/babatundeolawale"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold py-2 px-6 rounded-lg transition duration-200 border-2 border-white hover:bg-white hover:text-gray-700"
            >
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20" style={{ backgroundColor: '#8A7E73', borderTop: '2px solid #D4A17A' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-white text-sm opacity-90">
          <p>&copy; 2024 Saybaba. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
