import { CreateUserInput, UpdateUserInput } from './types'
import { UserRepository } from './userRepository'

export class UserService {
  static async getUserById(id: string) {
    const { data, error } = await UserRepository.findById(id)
    if (error) throw error
    if (!data || data.length === 0) {
      throw new Error(`User mit ID ${id} nicht gefunden`)
    }
    return data[0]
  }

  static async getUserByEmail(email: string) {
    const { data, error } = await UserRepository.findByEmail(email)
    if (error) throw error
    if (!data || data.length === 0) {
      throw new Error(`User mit Email ${email} nicht gefunden`)
    }
    return data[0]
  }

  static async createUser(input: CreateUserInput) {
    // Prüfen ob User bereits existiert
    const { data } = await UserRepository.findByEmail(input.email)
    if (data && data.length > 0) {
      throw new Error(`User mit Email ${input.email} existiert bereits`)
    }

    const { data: newUser, error } = await UserRepository.create(input)
    if (error) throw error
    return newUser![0]
  }

  static async updateUser(id: string, input: UpdateUserInput) {
    // Prüfen ob User existiert
    await this.getUserById(id)

    if (input.email) {
      // Prüfen ob neue Email bereits verwendet wird
      const { data } = await UserRepository.findByEmail(input.email)
      if (data && data.length > 0 && data[0].id !== id) {
        throw new Error(`Email ${input.email} wird bereits verwendet`)
      }
    }

    const { data: updatedUser, error } = await UserRepository.update(id, input)
    if (error) throw error
    return updatedUser![0]
  }
} 