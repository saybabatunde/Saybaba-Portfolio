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
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-cyan-900 border-b border-cyan-400 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Saybaba Portfolio</h1>
            <p className="text-cyan-300 text-sm">Welcome, {username}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
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
          <p className="text-white text-lg max-w-2xl">
            Explore my projects across cloud platforms (AWS, Azure), Python development, and full-stack applications. Each project showcases my expertise in infrastructure, automation, and software development.
          </p>
        </div>

        {/* Live Projects / Interactive Demos */}
        <section className="mb-16 animate-fade-in">
          <h3 className="text-2xl font-bold text-white mb-8 border-b-2 border-sky-600 pb-4">
            🔴 Live Projects (Interactive Demos)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AWS User Onboarding Portal */}
            <Link href="/dashboard/onboarding">
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg border-2 border-orange-400 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-600/40 transition duration-300 p-6 cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">⚙️</span>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-slate-800">AWS User Onboarding</h4>
                    <p className="text-sm text-slate-800 font-semibold">Live Demo with Real AWS Integration</p>
                  </div>
                </div>
                <p className="text-slate-900 mb-4 font-medium">
                  Create real IAM users with a single click. See real AWS API calls, audit logs, and infrastructure in action. Built with Lambda, API Gateway, and DynamoDB.
                </p>
                <div className="flex items-center gap-2 text-slate-900 font-bold group-hover:gap-3">
                  Open Demo <span>→</span>
                </div>
              </div>
            </Link>

            {/* Azure User Onboarding Portal */}
            <Link href="/projects/azure-onboarding">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg border-2 border-cyan-400 hover:border-cyan-300 hover:shadow-lg hover:shadow-blue-500/40 transition duration-300 p-6 cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">☁️</span>
                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-cyan-100">Azure User Onboarding</h4>
                    <p className="text-sm text-white font-semibold">Live Demo on Azure Static Web Apps</p>
                  </div>
                </div>
                <p className="text-white mb-4 font-medium">
                  Experience Azure cloud deployment. Frontend hosted on Azure Static Web Apps with serverless architecture. See multi-cloud infrastructure in action.
                </p>
                <div className="flex items-center gap-2 text-white font-bold group-hover:gap-3">
                  Open Demo <span>→</span>
                </div>
              </div>
            </Link>

            {/* Infrastructure Health Dashboard */}
            <Link href="/dashboard/monitoring">
              <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-lg border-2 border-purple-400 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-600/40 transition duration-300 p-6 cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📊</span>
                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-purple-100">Infrastructure Health Dashboard</h4>
                    <p className="text-sm text-white font-semibold">Real-Time Cloud Monitoring</p>
                  </div>
                </div>
                <p className="text-white mb-4 font-medium">
                  Monitor all connected services in real-time. Track GitHub, Supabase, Vercel, Resend, AWS, and Azure health. View CPU/RAM metrics and uptime percentages.
                </p>
                <div className="flex items-center gap-2 text-white font-bold group-hover:gap-3">
                  Open Dashboard <span>→</span>
                </div>
              </div>
            </Link>

            {/* CI/CD Pipeline Project */}
            <Link href="/projects/cicd-pipeline">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-lg border-2 border-emerald-400 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-600/40 transition duration-300 p-6 cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🔄</span>
                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-emerald-100">CI/CD Pipeline on Kubernetes</h4>
                    <p className="text-sm text-white font-semibold">Production DevOps Project</p>
                  </div>
                </div>
                <p className="text-white mb-4 font-medium">
                  Complete DevOps pipeline from code to production. GitHub Actions → Docker → Azure ACR → Kubernetes (AKS) → Azure Monitor. 5 phases of production-ready infrastructure.
                </p>
                <div className="flex items-center gap-2 text-white font-bold group-hover:gap-3">
                  View Project <span>→</span>
                </div>
              </div>
            </Link>

            {/* Infrastructure Request Portal */}
            <Link href="/infrastructure-portal">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg border-2 border-indigo-400 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-600/40 transition duration-300 p-6 cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🏗️</span>
                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-indigo-100">Infrastructure Request Portal</h4>
                    <p className="text-sm text-white font-semibold">Azure Provisioning Tool</p>
                  </div>
                </div>
                <p className="text-white mb-4 font-medium">
                  Request and provision Azure infrastructure on-demand. Select VM size, region, and compliance level. Automated deployment via Terraform with cost controls and budget alerts.
                </p>
                <div className="flex items-center gap-2 text-white font-bold group-hover:gap-3">
                  Request Infrastructure <span>→</span>
                </div>
              </div>
            </Link>
          </div>
          <p className="text-sm text-white mt-4">
            💡 <span className="text-yellow-400">Live Projects:</span> All demos are fully functional with real integrations. Explore interactive dashboards and production DevOps pipeline.
          </p>
        </section>

        {/* AI-Assisted Development Projects */}
        <section className="mb-16 animate-fade-in">
          <h3 className="text-2xl font-bold text-white mb-8 border-b border-cyan-400 pb-4">
            🤖 AI-Assisted Development Projects (Claude Build)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cloud Cost ROI Calculator */}
            <Link href="/projects/cloud-cost-roi-calculator">
              <div className="bg-indigo-900 rounded-lg border-2 border-cyan-400 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/30 transition duration-300 p-6 cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">💰</span>
                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-cyan-300">Cloud Cost ROI Calculator</h4>
                    <p className="text-sm text-cyan-400">AI-Assisted Development</p>
                  </div>
                </div>
                <p className="text-white mb-4">
                  Calculate return on investment for cloud infrastructure deployments. Input costs and metrics, get instant ROI analysis with visual charts and exportable reports.
                </p>
                <div className="flex items-center gap-2 text-cyan-400 font-semibold group-hover:gap-3">
                  View Project <span>→</span>
                </div>
              </div>
            </Link>

            {/* AI-Powered Quote Generator */}
            <Link href="/projects/ai-quote-generator">
              <div className="bg-indigo-900 rounded-lg border-2 border-cyan-400 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/30 transition duration-300 p-6 cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">✨</span>
                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-cyan-300">AI-Powered Quote Generator</h4>
                    <p className="text-sm text-cyan-400">AI-Assisted Development</p>
                  </div>
                </div>
                <p className="text-white mb-4">
                  Generate unique quotes powered by Claude AI. Select themes, save favorites, export as images, and share on social media. Built with Next.js and Claude API.
                </p>
                <div className="flex items-center gap-2 text-cyan-400 font-semibold group-hover:gap-3">
                  View Project <span>→</span>
                </div>
              </div>
            </Link>
          </div>
          <p className="text-sm text-white mt-4">
            ✨ <span className="text-cyan-400">AI-Built:</span> Showcasing rapid development with Claude AI and MCP servers. These projects demonstrate modern AI-assisted development practices.
          </p>
        </section>

        {/* Project Sections */}
        <div className="space-y-16">
          {categories.map((category) => {
            const categoryProjects = projects.filter((p) => p.category === category)
            return (
              <section key={category} className="animate-fade-in">
                <h3 className="text-2xl font-bold text-white mb-8 border-b border-cyan-400 pb-4">
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
        <section className="mt-20 text-center py-12 bg-blue-800 rounded-lg border border-cyan-400">
          <h3 className="text-2xl font-bold text-white mb-4">
            Want to learn more?
          </h3>
          <p className="text-white mb-6">
            Check out my GitHub, LinkedIn, or contact me directly for collaboration opportunities.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/saybabatunde"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/babatundeolawale"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-800 border-t border-cyan-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-white text-sm">
          <p>&copy; 2024 Saybaba. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
