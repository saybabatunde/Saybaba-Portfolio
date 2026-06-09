'use client'

import Link from 'next/link'
import type { Project } from '@/lib/projects'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-600 transition duration-300 p-6 hover:shadow-xl hover:shadow-blue-600/20">
      <h4 className="text-xl font-bold text-white mb-2">{project.title}</h4>
      <p className="text-gray-400 mb-4">{project.description}</p>
      <Link
        href={`/dashboard/projects/${project.slug}`}
        className="inline-block text-blue-400 hover:text-blue-300 font-semibold transition duration-200"
      >
        View Project →
      </Link>
    </div>
  )
}
