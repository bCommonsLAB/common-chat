'use server'

import { supabaseServer } from '@/lib/supabase/server'

interface QueryFilter {
  [key: string]: string | number | boolean | null
}

interface DatabaseResponse<T> {
  data: T | null
  error: Error | null
}

export async function getDatabaseData<T>(table: string, query: QueryFilter): Promise<DatabaseResponse<T[]>> {
  try {
    const { data, error } = await supabaseServer
      .from(table)
      .select()
      .match(query)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Database error:', error)
    return { data: null, error: error as Error }
  }
}

export async function insertDatabaseData<T>(table: string, data: Partial<T>): Promise<DatabaseResponse<T[]>> {
  try {
    const { data: insertedData, error } = await supabaseServer
      .from(table)
      .insert(data)
      .select()

    if (error) throw error
    return { data: insertedData, error: null }
  } catch (error) {
    console.error('Database error:', error)
    return { data: null, error: error as Error }
  }
}

export async function updateDatabaseData<T>(
  table: string, 
  query: QueryFilter, 
  data: Partial<T>
): Promise<DatabaseResponse<T[]>> {
  try {
    const { data: updatedData, error } = await supabaseServer
      .from(table)
      .update(data)
      .match(query)
      .select()

    if (error) throw error
    return { data: updatedData, error: null }
  } catch (error) {
    console.error('Database error:', error)
    return { data: null, error: error as Error }
  }
} 