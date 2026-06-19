'use client'

import { useState } from 'react'
import type { AuditLog } from '@/lib/types'

const API_URL = '/api'

export default function CreateUserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    group: 'developers',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AuditLog | null>(null)
  const [error, setError] = useState<{ title: string; message: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${API_URL}/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError({
          title: data.error || 'Oops! Something went wrong',
          message: data.message || 'Failed to create user. Please try again.'
        })
        return
      }

      setResult(data)
      setFormData({ name: '', email: '', group: 'developers' })
    } catch (err) {
      setError({
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your connection and try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-cyan-400 p-8">
      {/* Demo Notice */}
      <div className="mb-6 p-4 bg-blue-900/30 border border-cyan-400 rounded-lg">
        <p className="text-black text-sm">
          <span className="font-semibold">📋 Demo Mode:</span> This is a test environment. Feel free to supply your username and email to test the system and receive a confirmation notification. You'll be able to verify the onboarding flow works end-to-end.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-black mb-6">Create New User</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-black font-semibold mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Sarah Johnson"
            required
            className="w-full bg-white700 border border-cyan-400 text-black px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-black font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g., sarah@company.com"
            required
            className="w-full bg-white700 border border-cyan-400 text-black px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Group */}
        <div>
          <label className="block text-black font-semibold mb-2">Group</label>
          <select
            name="group"
            value={formData.group}
            onChange={handleChange}
            className="w-full bg-white700 border border-cyan-400 text-black px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="developers">Developers</option>
            <option value="admins">Admins</option>
            <option value="finance">Finance</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-400 hover:bg-slate-500 disabled:bg-white600 text-black font-semibold py-3 rounded-lg transition duration-200"
        >
          {loading ? 'Creating User...' : 'Approve & Create User'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-600 rounded-lg">
          <p className="text-black font-semibold">{error.title}</p>
          <p className="text-black text-sm mt-2">{error.message}</p>
          <p className="text-black text-xs mt-3">
            ℹ️ If the issue persists, our team has been notified and will resolve it shortly.
          </p>
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className="mt-6 p-4 bg-green-900/30 border border-cyan-400 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✓</span>
            <p className="text-black font-semibold">User Created Successfully!</p>
          </div>
          <div className="space-y-2 text-black text-sm mb-4">
            <p><span className="font-semibold">Username:</span> {result.username}</p>
            <p><span className="font-semibold">Email:</span> {result.email}</p>
            <p><span className="font-semibold">Group:</span> {result.group}</p>
            <p><span className="font-semibold">Audit ID:</span> {result.auditId}</p>
          </div>
          <div className="border-t border-cyan-400 pt-4 mt-4 p-3 bg-yellow-900/40 border border-yellow-600 rounded-lg">
            <p className="text-black text-sm font-semibold">
              ✉️ Check your email to confirm you received the onboarding notification. This demonstrates the system's notification and audit capabilities working end-to-end.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
