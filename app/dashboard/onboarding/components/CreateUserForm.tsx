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
        body: JSON.stringify({ ...formData, platform: 'aws' }),
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
    <div className="rounded-lg p-8" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E0E0E0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Create New User</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block font-semibold mb-2" style={{ color: '#8B4513' }}>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Sarah Johnson"
            required
            className="w-full border text-black px-4 py-2 rounded-lg focus:outline-none"
            style={{ backgroundColor: '#F9F9F9', borderColor: '#D0D0D0' }}
            onFocus={(e) => (e.target.style.borderColor = '#8B4513')}
            onBlur={(e) => (e.target.style.borderColor = '#D0D0D0')}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold mb-2" style={{ color: '#8B4513' }}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g., sarah@company.com"
            required
            className="w-full border text-black px-4 py-2 rounded-lg focus:outline-none"
            style={{ backgroundColor: '#F9F9F9', borderColor: '#D0D0D0' }}
            onFocus={(e) => (e.target.style.borderColor = '#8B4513')}
            onBlur={(e) => (e.target.style.borderColor = '#D0D0D0')}
          />
        </div>

        {/* Group */}
        <div>
          <label className="block font-semibold mb-2" style={{ color: '#8B4513' }}>Group</label>
          <select
            name="group"
            value={formData.group}
            onChange={handleChange}
            className="w-full border text-black px-4 py-2 rounded-lg focus:outline-none"
            style={{ backgroundColor: '#F9F9F9', borderColor: '#D0D0D0' }}
            onFocus={(e) => (e.target.style.borderColor = '#8B4513')}
            onBlur={(e) => (e.target.style.borderColor = '#D0D0D0')}
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
          className="w-full text-white font-semibold py-3 rounded-lg transition duration-200"
          style={{
            backgroundColor: loading ? '#A0522D' : '#8B4513',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#A0522D')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#8B4513')}
        >
          {loading ? 'Creating User...' : 'Approve & Create User'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#FBE8E8', border: '2px solid #D4A17A' }}>
          <p className="font-semibold" style={{ color: '#8B4513' }}>{error.title}</p>
          <p className="text-sm mt-2" style={{ color: '#6B5644' }}>{error.message}</p>
          <p className="text-xs mt-3" style={{ color: '#8B4513' }}>
            ℹ️ If the issue persists, our team has been notified and will resolve it shortly.
          </p>
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F0F8F4', border: '2px solid #8B4513' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">✓</span>
            <p className="font-bold text-lg" style={{ color: '#8B4513' }}>User Created Successfully!</p>
          </div>
          <div className="space-y-2 text-sm mb-4" style={{ color: '#333333' }}>
            <p><span className="font-semibold">Username:</span> {result.username}</p>
            <p><span className="font-semibold">Email:</span> {result.email}</p>
            <p><span className="font-semibold">Group:</span> {result.group}</p>
            <p><span className="font-semibold">Audit ID:</span> {result.auditId}</p>
          </div>
          <div className="rounded-lg p-3 mt-4" style={{ backgroundColor: '#FFF8E8', border: '2px solid #D4A17A' }}>
            <p className="text-sm font-semibold" style={{ color: '#8B4513' }}>
              ✉️ Check your email to confirm you received the onboarding notification. This demonstrates the system's notification and audit capabilities working end-to-end.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
