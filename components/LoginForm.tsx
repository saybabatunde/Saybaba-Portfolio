'use client'

import { useState, FormEvent } from 'react'

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>
  isLoading: boolean
  error: string
}

export default function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit(username, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username Input */}
      <div>
        <label htmlFor="username" className="block text-sm font-black text-gray-700 mb-2">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-sky-50 border-2 border-sky-200 rounded-lg text-black font-black placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
          required
        />
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-sm font-black text-gray-700 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-sky-50 border-2 border-sky-200 rounded-lg text-black font-black placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
          required
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-100 border-2 border-red-300 rounded-lg">
          <p className="text-red-700 text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 disabled:bg-slate-400 text-white font-black py-2 px-4 rounded-lg transition duration-200 mt-6 text-sm"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
