import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_PROJECT_URL) {
  throw new Error('SUPABASE_PROJECT_URL ist nicht definiert')
}

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_ANON_KEY ist nicht definiert')
}

export const supabaseServer = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
    }
  }
) 