'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AboutMePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const logged_in = localStorage.getItem('logged_in')
    const user = localStorage.getItem('username')

    if (!logged_in || !user) {
      router.push('/')
      return
    }

    setIsAuthenticated(true)
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF4D8' }}>
        <p style={{ color: '#0F2A4A' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: '#2563EB' }}>
            About Me
          </h1>
          <div className="w-16 h-1 mt-4" style={{ backgroundColor: '#2563EB' }}></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
          {/* Picture Section */}
          <div className="md:col-span-2 flex justify-center md:justify-start">
            <div
              className="relative w-72 h-80 rounded-lg overflow-hidden"
              style={{
                backgroundColor: '#FFFFFF',
                border: `2px solid #E5E7EB`,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Image
                src="/images/me.png"
                alt="Babatunde Olawale"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Bio Section */}
          <div className="md:col-span-3">
            <div
              className="rounded-lg p-10 space-y-6"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              {/* Name & Title */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#111827' }}>
                  Babatunde Olawale
                </h2>
                <p className="text-lg font-semibold" style={{ color: '#2563EB' }}>
                  Senior Hybrid Cloud & Infrastructure Engineer
                </p>
              </div>

              {/* Bio Paragraphs */}
              <div className="space-y-5 border-t pt-6" style={{ borderColor: '#E5E7EB' }}>
                <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify' }}>
                  I build secure, automated infrastructure across cloud, hybrid, and on-prem environments with a focus on reliability, identity, automation, and operational discipline.
                </p>

                <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify' }}>
                  Over the past 7+ years, I've supported, modernized, and automated enterprise infrastructure across Azure, AWS, VMware, Windows Server, Active Directory, Entra ID, and production datacenter environments. My work has included maintaining 150+ production servers at 99.9% availability, supporting VMware-to-Azure migrations, reducing manual effort through Infrastructure as Code, improving incident response, and helping teams bring better governance to cloud operations.
                </p>

                <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify' }}>
                  My strength is bridging traditional infrastructure with modern cloud operations. I understand the foundation—servers, networking, virtualization, Active Directory, DNS, identity, backup, monitoring, and security—but I also build for where infrastructure is going: automated, repeatable, secure by default, and easier to operate at scale.
                </p>

                <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify' }}>
                  Day to day, I work across Azure, AWS, VMware, Terraform, ARM/Bicep, Ansible, PowerShell, Python, Azure DevOps, GitHub Actions, Intune, Microsoft Defender, Entra ID, IAM, and Zero Trust security practices. I use these tools to solve practical business problems: reducing manual work, strengthening access control, improving uptime, supporting migrations, and turning fragile infrastructure into reliable operating platforms.
                </p>

                <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify' }}>
                  I'm also applying AI directly to infrastructure operations. Using tools like Claude Code, MCP servers, and custom agents, I build and refine workflows that assist with provisioning, access reviews, Infrastructure-as-Code, troubleshooting, documentation, and routine operational tasks. The goal is not to replace engineering judgment; it is to remove repetitive work so engineers can focus on architecture, risk, reliability, and better decisions.
                </p>

                <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify' }}>
                  What I bring is a mix of hands-on infrastructure depth, cloud engineering, automation, identity, and production-support experience. I'm comfortable owning complex environments, troubleshooting under pressure, and building systems that work beyond the design document.
                </p>

                <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify' }}>
                  If your team is modernizing infrastructure, scaling cloud operations, strengthening identity and access, or bringing AI-assisted automation into day-to-day operations, that is the kind of work I do best.
                </p>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-10 flex justify-center md:justify-start">
              <button
                onClick={() => router.push('/dashboard')}
                className="font-semibold py-3 px-8 rounded-lg transition duration-300 flex items-center gap-2 hover:gap-3"
                style={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1D4ED8'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.2)'
                }}
              >
                View My Portfolio
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Accent */}
      <div className="mt-20 border-t" style={{ borderColor: '#E5E7EB' }}></div>
    </div>
  )
}
