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
        router.push('/dashboard')
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to baba's Portfolio
          </h1>
          <p className="text-white text-lg">
            Showcasing Cloud & Development Expertise
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-cyan-400">
          <h2 className="text-2xl font-black text-black mb-2 text-base">Login</h2>
          <p className="text-black text-sm mb-6 font-bold">
            Kindly use <span className="font-black text-black">Admin</span> for username and password to gain access
          </p>

          <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

          {/* Demo Credentials Hint */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-cyan-400">
            <p className="text-sm text-black text-center font-black">
              Demo Access:<br />
              Username: <span className="text-black font-mono font-black">admin</span><br />
              Password: <span className="text-black font-mono font-black">admin</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>&copy; 2024 Saybaba. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
