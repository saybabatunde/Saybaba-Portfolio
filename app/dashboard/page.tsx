'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProjectCard from '@/components/ProjectCard'

const projects = {
  AWS: [
    {
      id: 1,
      title: 'AWS Infrastructure Automation',
      description: 'Terraform modules for EC2, RDS, S3, and VPC setup',
      link: '#',
    },
    {
      id: 2,
      title: 'AWS Lambda Microservices',
      description: 'Serverless REST APIs using Lambda and API Gateway',
      link: '#',
    },
  ],
  Azure: [
    {
      id: 3,
      title: 'Azure Bicep Templates',
      description: 'IaC templates for App Service, SQL, Storage deployment',
      link: '#',
    },
    {
      id: 4,
      title: 'Azure Kubernetes Service',
      description: 'Kubernetes cluster setup and pod deployment',
      link: '#',
    },
  ],
  Python: [
    {
      id: 5,
      title: 'Data Pipeline ETL',
      description: 'Python-based data processing and transformation pipeline',
      link: '#',
    },
    {
      id: 6,
      title: 'API with FastAPI',
      description: 'RESTful API with async request handling',
      link: '#',
    },
  ],
  Apps: [
    {
      id: 7,
      title: 'Portfolio Website',
      description: 'Next.js + Tailwind CSS responsive portfolio',
      link: '#',
    },
    {
      id: 8,
      title: 'Task Management App',
      description: 'React app with local storage and drag-and-drop',
      link: '#',
    },
  ],
}

type ProjectCategory = 'AWS' | 'Azure' | 'Python' | 'Apps'

export default function DashboardPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is logged in
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

        {/* Project Sections */}
        <div className="space-y-16">
          {Object.entries(projects).map(([category, categoryProjects]) => (
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
          ))}
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
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
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
