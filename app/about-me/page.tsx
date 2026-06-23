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
      <div className="min-h-screen bg-blue-950 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFE4B5' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-8 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold">Welcome</h1>
          <p className="text-blue-100 mt-2">Get to know me and my work</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Picture Section */}
          <div className="md:col-span-1 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-96 rounded-lg overflow-hidden shadow-2xl border-4 border-white">
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
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Babatunde Olawale</h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                Hybrid Cloud Infrastructure Engineer who turns messy, manual, on-prem environments into secure, automated, cloud-ready systems. Over the past seven-plus years I've worked across the full arc of enterprise IT — from racking servers and running production support to architecting multi-cloud infrastructure that mostly runs itself.
              </p>

              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                My foundation is traditional infrastructure done right: Windows Server, virtualization, networking, and Active Directory, with the kind of production-support instincts you only build by being the person who gets the 2 a.m. page. That foundation grew into cloud — Azure and AWS — and into the disciplines that make modern infrastructure dependable: Infrastructure-as-Code, CI/CD, automation, monitoring, identity, and security built on Zero Trust principles.
              </p>

              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                Day to day, I work across Azure, AWS, Terraform, ARM/Bicep, Ansible, PowerShell, Python, Azure DevOps, GitHub Actions, Intune, and Microsoft Defender. But the tools are just the means. What I actually care about is the outcome: infrastructure that's secure by default, automated end to end, and scalable without the chaos — the kind that lets a team modernize from on-prem to cloud without breaking what already works.
              </p>

              <p className="text-gray-700 text-sm leading-relaxed">
                I'm drawn to real infrastructure problems, not theoretical ones. Cutting manual toil. Tightening access control. Making monitoring tell you something before it's an incident. Building deployment patterns repeatable enough that the right way becomes the easy way.
              </p>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm font-semibold">
                  This portfolio is the proof. Each project here is built around a genuine infrastructure challenge — multi-cloud automation, IAM, CI/CD, Kubernetes, Terraform, cloud monitoring, cost visibility, and onboarding workflows — and every one is designed to do the same four things: reduce manual work, improve reliability, strengthen security, and make cloud operations easier to manage at scale.
                </p>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 flex justify-center md:justify-start">
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-lg transition shadow-lg text-lg"
              >
                Next → View My Portfolio
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
