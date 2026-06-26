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
                  Cloud Infrastructure Engineer
                </p>
              </div>

              {/* Bio Paragraphs */}
              <div className="space-y-5 border-t pt-6" style={{ borderColor: '#E5E7EB' }}>
                <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify' }}>
                  I build secure, automated, cloud-native infrastructure that scales without the chaos. Over seven-plus years, I've architected and operated multi-cloud platforms across Azure and AWS the kind that provision themselves, heal themselves, and tell you when something's wrong before it becomes an incident.
                </p>

                <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify' }}>
                  My work lives in the cloud and the disciplines that make it dependable: Infrastructure-as-Code, CI/CD, automation, monitoring, identity, and security built on Zero Trust principles. I design environments that are secure by default, automated end to end, and repeatable enough that the right way becomes the easy way. Behind that sits a deep infrastructure foundation of Windows Server, VMware and Hyper-V virtualization, networking, and Active Directory, and the production-support instincts you only earn by being the person who gets the 2 a.m page. It's why my cloud designs hold up under real-world pressure, not just on a whiteboard.
                </p>

                <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify' }}>
                  Day to day, I work across Azure, AWS, VMware, Terraform, ARM/Bicep, Ansible, PowerShell, Python, Azure DevOps, GitHub Actions, Intune, and Microsoft Defender. But the tools are just the means. What I care about is the outcome: cutting manual toil, tightening access control, turning fragile setups into self-running systems, and leading VMware-to-Azure migrations that move legacy environments into the cloud without breaking what already works.
                </p>

                <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify' }}>
                  Increasingly, that means putting AI to work on the infrastructure itself. I build AI agents and tooling that handle routine ops provisioning access, running simple changes, drafting and reviewing IaC so those tasks don't burn engineering hours, and I use AI daily to reason through harder problems faster: debugging, design trade-offs, and turning messy requirements into working automation. It's the same goal I've always had, just with a sharper tool: let the machine handle the repeatable work so engineers can focus on the decisions that actually need judgment.
                </p>

                <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify' }}>
                  This portfolio is the proof. Each project is built around a genuine cloud-infrastructure challenge, and every one is designed to do the same: reduce manual work, improve reliability, strengthen security, and make cloud operations easier to manage at scale.
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
