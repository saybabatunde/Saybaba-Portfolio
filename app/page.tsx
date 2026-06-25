'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (username: string, password: string) => {
    setError('')
    setIsLoading(true)

    try {
      // Demo login: hardcoded credentials
      if (username === 'admin' && password === 'admin') {
        // Store session
        localStorage.setItem('logged_in', 'true')
        localStorage.setItem('username', username)
        router.push('/about-me')
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#2563EB' }}>
            Welcome to baba's Portfolio
          </h1>
          <p className="text-lg" style={{ color: '#6B7280' }}>
            Showcasing Cloud & Development Expertise
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl shadow-lg p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>Login</h2>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
            Kindly use <span className="font-bold" style={{ color: '#2563EB' }}>Admin</span> for username and password to gain access
          </p>

          <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

          {/* Demo Credentials Hint */}
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F0F9FF', border: '1px solid #BFDBFE' }}>
            <p className="text-sm text-center font-semibold" style={{ color: '#111827' }}>
              Demo Access:<br />
              Username: <span className="font-mono" style={{ color: '#2563EB' }}>admin</span><br />
              Password: <span className="font-mono" style={{ color: '#2563EB' }}>admin</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm" style={{ color: '#9CA3AF' }}>
          <p>&copy; 2024 Saybaba. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
