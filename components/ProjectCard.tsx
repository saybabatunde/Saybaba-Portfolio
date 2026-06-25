'use client'

import Link from 'next/link'
import type { Project } from '@/lib/projects'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="rounded-lg border-2 transition duration-300 p-6 hover:shadow-xl" style={{ backgroundColor: '#FFFFFF', borderColor: '#D4A17A', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h4 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>{project.title}</h4>
      <p className="mb-4 font-bold" style={{ color: '#000000' }}>{project.description}</p>
      <Link
        href={`/dashboard/projects/${project.slug}`}
        className="inline-block font-bold transition duration-200" style={{ color: '#1A1A1A' }}
      >
        View Project →
      </Link>
    </div>
  )
}
