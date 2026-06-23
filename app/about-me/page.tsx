'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

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
    <div className="min-h-screen" style={{ backgroundColor: '#FFF4D8' }}>
      {/* Header */}
      <header className="border-b" style={{ backgroundColor: '#0F2A4A', borderColor: '#D4A017' }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: '#FFFDF7' }}>
            About Me
          </h1>
          <div className="w-12 h-1 mt-4" style={{ backgroundColor: '#D4A017' }}></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
          {/* Picture Section */}
          <div className="md:col-span-2 flex justify-center md:justify-start">
            <div
              className="relative w-72 h-80 rounded-2xl overflow-hidden"
              style={{
                backgroundColor: '#FFFDF7',
                border: `3px solid #D4A017`,
                boxShadow: '0 10px 40px rgba(15, 42, 74, 0.15)',
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
              className="rounded-2xl p-10 space-y-6"
              style={{
                backgroundColor: '#FFFDF7',
                boxShadow: '0 4px 20px rgba(15, 42, 74, 0.08)',
              }}
            >
              {/* Name & Title */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#0F2A4A' }}>
                  Babatunde Olawale
                </h2>
                <p className="text-lg font-medium" style={{ color: '#D4A017' }}>
                  Hybrid Cloud Infrastructure Engineer
                </p>
              </div>

              {/* Bio Paragraphs */}
              <div className="space-y-5 border-t pt-6" style={{ borderColor: '#D4A017' }}>
                <p style={{ color: '#1F2937', lineHeight: '1.8', fontSize: '0.95rem' }}>
                  I turn messy, manual, on-prem environments into secure, automated, cloud-ready systems. Over seven-plus years, I've worked across the full arc of enterprise IT — from racking servers and running production support to architecting multi-cloud infrastructure that mostly runs itself.
                </p>

                <p style={{ color: '#1F2937', lineHeight: '1.8', fontSize: '0.95rem' }}>
                  My foundation is traditional infrastructure done right: Windows Server, virtualization, networking, and Active Directory — the kind of production-support instincts you only build by being the person who gets the 2 a.m. page. That foundation grew into cloud, Azure and AWS, and into the disciplines that make modern infrastructure dependable: Infrastructure-as-Code, CI/CD, automation, monitoring, identity, and security built on Zero Trust principles.
                </p>

                <p style={{ color: '#1F2937', lineHeight: '1.8', fontSize: '0.95rem' }}>
                  Day to day, I work across Azure, AWS, Terraform, ARM/Bicep, Ansible, PowerShell, Python, Azure DevOps, GitHub Actions, Intune, and Microsoft Defender. But the tools are just the means. What I actually care about is the outcome: infrastructure that's secure by default, automated end to end, and scalable without the chaos.
                </p>

                <p style={{ color: '#1F2937', lineHeight: '1.8', fontSize: '0.95rem' }}>
                  I'm drawn to real infrastructure problems. Cutting manual toil. Tightening access control. Making monitoring tell you something before it's an incident. Building deployment patterns repeatable enough that the right way becomes the easy way.
                </p>
              </div>

              {/* Closing Statement */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: '#D4A017' }}>
                <p style={{ color: '#0F2A4A', lineHeight: '1.7', fontSize: '0.9rem', fontWeight: '500' }}>
                  This portfolio is the proof. Each project here is built around a genuine infrastructure challenge — and every one is designed to do the same: reduce manual work, improve reliability, strengthen security, and make cloud operations easier to manage at scale.
                </p>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-10 flex justify-center md:justify-start">
              <button
                onClick={() => router.push('/dashboard')}
                className="font-semibold py-4 px-8 rounded-xl transition duration-300 flex items-center gap-2 hover:gap-3"
                style={{
                  backgroundColor: '#0F2A4A',
                  color: '#FFFDF7',
                  boxShadow: '0 4px 15px rgba(15, 42, 74, 0.2)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 25px rgba(15, 42, 74, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 15px rgba(15, 42, 74, 0.2)')}
              >
                View My Portfolio
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Accent */}
      <div className="mt-20 border-t" style={{ borderColor: '#D4A017' }}></div>
    </div>
  )
}
