'use server'

import { supabaseServer } from '@/lib/supabase/server'

interface UserData {
  email: string;
  name: string;
  lastaccess_at: string;
  created_at?: string;
}

export async function updateUserAccess(email: string, name: string): Promise<void> {
  if (!email) return;

  try {
    // Versuche den Benutzer zu finden
    const { error: fetchError } = await supabaseServer
      .from('users')
      .select()
      .eq('email', email)
      .single();

    if (!fetchError) {
      // Benutzer existiert bereits, aktualisiere lastaccess_at
      const { error: updateError } = await supabaseServer
        .from('users')
        .update({ 
          lastaccess_at: new Date().toISOString(),
          name: name // Aktualisiere auch den Namen, falls er sich geändert hat
        })
        .eq('email', email);

      if (updateError) {
        throw new Error(`Fehler beim Aktualisieren des Benutzers: ${updateError.message}`);
      }
    } else {
      // Benutzer existiert nicht, erstelle einen neuen Eintrag
      const userData: UserData = {
        email,
        name,
        lastaccess_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      const { error: insertError } = await supabaseServer
        .from('users')
        .insert([userData]);

      if (insertError) {
        throw new Error(`Fehler beim Erstellen des Benutzers: ${insertError.message}`);
      }
    }
  } catch (error) {
    console.error('User Action Error:', error);
    throw error;
  }
} 