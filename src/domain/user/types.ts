export interface User {
  id: string
  email: string
  name: string | null
  created_at: string
  updated_at: string
}

export interface CreateUserInput {
  email: string
  name?: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
} 