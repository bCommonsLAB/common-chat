import { NextResponse } from 'next/server'
import { supabase } from '@/services/supabase'

export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Benutzer' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          email: body.email,
          name: body.name,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Benutzers' },
      { status: 500 }
    )
  }
} 