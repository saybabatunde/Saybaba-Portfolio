'use client'

import { useState } from 'react'
import { createUser } from '@/lib/api'
import type { AuditLog } from '@/lib/types'

export default function CreateUserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    group: 'developers',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AuditLog | null>(null)
  const [error, setError] = useState<string | null>(null)

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
      const response = await createUser(formData)
      setResult(response)
      setFormData({ name: '', email: '', group: 'developers' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Create New User</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-gray-300 font-semibold mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Sarah Johnson"
            required
            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-300 font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g., sarah@company.com"
            required
            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Group */}
        <div>
          <label className="block text-gray-300 font-semibold mb-2">IAM Group</label>
          <select
            name="group"
            value={formData.group}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
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
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          {loading ? 'Creating User...' : 'Approve & Create User'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-600 rounded-lg text-red-300">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className="mt-6 p-4 bg-green-900/30 border border-green-600 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✓</span>
            <p className="text-green-300 font-semibold">User Created Successfully!</p>
          </div>
          <div className="space-y-2 text-green-300 text-sm">
            <p><span className="font-semibold">Username:</span> {result.username}</p>
            <p><span className="font-semibold">Email:</span> {result.email}</p>
            <p><span className="font-semibold">Group:</span> {result.group}</p>
            <p><span className="font-semibold">Audit ID:</span> {result.auditId}</p>
          </div>
        </div>
      )}
    </div>
  )
}
