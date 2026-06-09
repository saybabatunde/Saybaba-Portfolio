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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  // Group projects by category
  const categories = Array.from(new Set(projects.map((p) => p.category)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Saybaba Portfolio</h1>
            <p className="text-gray-400 text-sm">Welcome, {username}!</p>
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
          <p className="text-gray-400 text-lg max-w-2xl">
            Explore my projects across cloud platforms (AWS, Azure), Python development, and full-stack applications. Each project showcases my expertise in infrastructure, automation, and software development.
          </p>
        </div>

        {/* Live Projects / Interactive Demos */}
        <section className="mb-16 animate-fade-in">
          <h3 className="text-2xl font-bold text-white mb-8 border-b border-green-600 pb-4">
            🔴 Live Projects (Interactive Demos)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AWS User Onboarding Portal */}
            <Link href="/dashboard/onboarding">
              <div className="bg-gradient-to-br from-orange-900/30 to-gray-900 rounded-lg border-2 border-orange-600 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-600/30 transition duration-300 p-6 cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">⚙️</span>
                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-orange-300">AWS User Onboarding</h4>
                    <p className="text-sm text-orange-400">Live Demo with Real AWS Integration</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  Create real IAM users with a single click. See real AWS API calls, audit logs, and infrastructure in action. Built with Lambda, API Gateway, and DynamoDB.
                </p>
                <div className="flex items-center gap-2 text-orange-400 font-semibold group-hover:gap-3">
                  Open Demo <span>→</span>
                </div>
              </div>
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            💡 <span className="text-yellow-400">Demo Mode:</span> Creates real AWS IAM users. Full audit trail of all actions. Clean up anytime from AWS console.
          </p>
        </section>

        {/* Project Sections */}
        <div className="space-y-16">
          {categories.map((category) => {
            const categoryProjects = projects.filter((p) => p.category === category)
            return (
              <section key={category} className="animate-fade-in">
                <h3 className="text-2xl font-bold text-white mb-8 border-b border-blue-600 pb-4">
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
        <section className="mt-20 text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">
            Want to learn more?
          </h3>
          <p className="text-gray-400 mb-6">
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
      <footer className="bg-gray-800 border-t border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Saybaba. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
