'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { getProjectBySlug, type Project } from '@/lib/projects'

const GITHUB_URL = 'https://github.com/saybabatunde'
const LINKEDIN_URL = 'https://www.linkedin.com/in/babatundeolawale'

export default function ProjectPage() {
  const router = useRouter()
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const slug = params?.slug as string

  useEffect(() => {
    const logged_in = localStorage.getItem('logged_in')
    const user = localStorage.getItem('username')

    if (!logged_in || !user) {
      router.push('/')
      return
    }

    setIsAuthenticated(true)
    const foundProject = getProjectBySlug(slug)
    if (foundProject) {
      setProject(foundProject)
    } else {
      router.push('/dashboard')
    }
  }, [slug, router])

  if (!isAuthenticated || !project) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-cyan-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/dashboard"
            className="text-blue-400 hover:text-blue-300 font-semibold transition duration-200 flex items-center gap-2"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Project Header */}
        <div className="mb-12 animate-fade-in">
          <div className="inline-block bg-blue-600/20 border border-cyan-400 text-blue-400 px-3 py-1 rounded-full text-sm mb-4">
            {project.category}
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">{project.title}</h1>
          <p className="text-white text-xl max-w-3xl mb-8">
            {project.fullDescription}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white700 hover:bg-white600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            )}
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
              </svg>
              Connect on LinkedIn
            </a>
          </div>
        </div>

        {/* Tech Stack */}
        <section className="mb-12 animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-6">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="bg-white border border-cyan-400 text-blue-400 px-4 py-2 rounded-lg text-sm font-semibold"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-12 animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-cyan-400 rounded-lg p-4 flex items-start gap-3"
              >
                <div className="text-black text-2xl mt-1 font-bold">✓</div>
                <p className="text-black text-base" style={{ fontSize: '15px' }}>{feature}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Deployment */}
        {project.deployment && (
          <section className="mb-12 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Live Demo</h2>
            <a
              href={project.deployment}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Visit Live Demo →
            </a>
          </section>
        )}

        {/* Back Button */}
        <div className="mt-16 pt-8 border-t border-cyan-400">
          <Link
            href="/dashboard"
            className="text-blue-400 hover:text-blue-300 font-semibold transition duration-200 flex items-center gap-2"
          >
            ← Back to All Projects
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-cyan-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-white text-sm">
          <p>&copy; 2024 Saybaba. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
