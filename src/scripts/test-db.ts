import * as dotenv from 'dotenv'
dotenv.config()

import { supabase } from '../services/supabase.js'

async function testDatabaseConnection() {
  console.log('🔍 Teste Supabase-Verbindung...')
  console.log('URL:', process.env.SUPABASE_PROJECT_URL)
  console.log('Key:', process.env.SUPABASE_ANON_KEY?.slice(0, 10) + '...')

  try {
    // Test 1: Verbindung testen
    const { error: connectionError } = await supabase.from('users').select('count').single()
    
    if (connectionError) {
      throw connectionError
    }
    console.log('✅ Verbindung erfolgreich hergestellt')

    // Test 2: Testbenutzer erstellen
    const testUser = {
      email: `test${Date.now()}@test.com`,
      name: 'Test User'
    }
    
    console.log('📝 Erstelle Testbenutzer:', testUser)
    
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([testUser])
      .select()
      .single()

    if (insertError) {
      throw insertError
    }
    console.log('✅ Testbenutzer erstellt:', newUser)

    // Test 3: Alle Benutzer abrufen
    const { data: users, error: selectError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (selectError) {
      throw selectError
    }
    console.log('📊 Aktuelle Benutzer in der Datenbank:', users.length)
    console.log(users)

  } catch (error) {
    console.error('❌ Fehler beim Testen:', error)
  }
}

// Führe den Test aus
testDatabaseConnection() 