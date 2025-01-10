import { getDatabaseData, insertDatabaseData, updateDatabaseData } from '@/app/actions/database'
import { CreateUserInput, UpdateUserInput, User } from './types'

export class UserRepository {
  private static readonly TABLE_NAME = 'users'

  static async findById(id: string) {
    return getDatabaseData<User>(this.TABLE_NAME, { id })
  }

  static async findByEmail(email: string) {
    return getDatabaseData<User>(this.TABLE_NAME, { email })
  }

  static async create(input: CreateUserInput) {
    return insertDatabaseData<User>(this.TABLE_NAME, {
      ...input,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }

  static async update(id: string, input: UpdateUserInput) {
    return updateDatabaseData<User>(
      this.TABLE_NAME,
      { id },
      {
        ...input,
        updated_at: new Date().toISOString(),
      }
    )
  }
} 