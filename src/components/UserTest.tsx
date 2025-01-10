'use client'

import { useState, useEffect } from 'react'
import type { Database } from '@/services/supabase'

type User = Database['public']['Tables']['users']['Row']

export default function UserTest() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTestUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          name: 'Test User',
        }),
      })
      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Testbenutzers:', error)
    }
  }

  if (loading) return <div>Laden...</div>

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Benutzer Test</h2>
      <button
        onClick={createTestUser}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Testbenutzer erstellen
      </button>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="border p-3 rounded shadow"
          >
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p className="text-sm text-gray-500">
              Erstellt: {new Date(user.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
} 