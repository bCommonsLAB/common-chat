'use server'

import { supabaseServer } from '@/lib/supabase/server'
import { RAGOption } from '@/types/rag'

export async function getAllChatbots(userEmail?: string): Promise<RAGOption[]> {
  try {
    console.log('Versuche Chatbots aus der Datenbank zu laden...');
    console.log('Benutzer-Status:', userEmail ? `Angemeldet (${userEmail})` : 'Anonym');

    let query = supabaseServer
      .from('chatbots')
      .select(`
        *,
        users!chatbots_user_id_fkey (
          id,
          name,
          email
        )
      `);

    // Filtere basierend auf Benutzer-Status
    if (userEmail) {
      // Angemeldeter Benutzer: Zeige öffentliche Chatbots und eigene Chatbots
      query = query.eq('users.email', userEmail);
    } else {
      // Anonymer Benutzer: Zeige nur öffentliche Chatbots
      query = query.eq('public', true);
    }

    const { data: chatbots, error } = await query.order('name');

    if (error) {
      console.error('Supabase Fehler beim Abrufen der Chatbots:', error);
      throw new Error(`Datenbankfehler: ${error.message}`);
    }

    if (!chatbots) {
      console.warn('Keine Chatbots in der Datenbank gefunden');
      return [];
    }

    console.log(`${chatbots.length} Chatbots aus der Datenbank geladen:`, 
      chatbots.map(bot => ({ 
        id: bot.bot_id, 
        name: bot.name,
        isPublic: !bot.user_id,
        user: bot.users ? `${bot.users.name} (${bot.users.email})` : 'Öffentlich'
      }))
    );

    // Konvertiere die Datenbank-Einträge in das RAGOption Format
    return chatbots.map(bot => ({
      id: bot.bot_id,
      name: bot.name,
      title: bot.title,
      description: bot.description || '',
      titleAvatarSrc: bot.title_avatar_src || '',
      welcomeMessage: bot.welcome_message || '',
      errorMessage: bot.error_message || '',
      url: bot.url || '',
      placeholder: bot.placeholder || '',
      maxChars: bot.max_chars || 500,
      maxCharsWarningMessage: bot.max_chars_warning_message || '',
      footerText: bot.footer_text || '',
      companyLink: bot.company_link || '',
      pineconeIndex: bot.pinecone_index || '',
      userId: bot.user_id || null,
      isPublic: bot.public
    }));
  } catch (error) {
    console.error('Fehler beim Abrufen der Chatbots:', error);
    throw error;
  }
}

export async function migrateChatbotsFromConfig(chatbots: RAGOption[]): Promise<void> {
  try {
    console.log('Starte Migration von', chatbots.length, 'Chatbots...');
    
    // Prüfe zuerst, ob die Tabelle existiert
    const { error: tableError } = await supabaseServer
      .from('chatbots')
      .select('count')
      .limit(1);

    if (tableError) {
      console.error('Tabelle existiert möglicherweise nicht:', tableError);
      throw new Error(`Tabelle 'chatbots' existiert nicht oder ist nicht zugänglich: ${tableError.message}`);
    }

    // Hole den ersten Admin-User als Default-Besitzer
    const { data: adminUser, error: userError } = await supabaseServer
      .from('users')
      .select('id')
      .limit(1)
      .single();

    if (userError) {
      console.warn('Kein Default-User gefunden:', userError);
    }

    const defaultUserId = adminUser?.id;

    for (const bot of chatbots) {
      console.log(`Migriere Chatbot: ${bot.id} (${bot.name})`);
      
      const { error: upsertError } = await supabaseServer
        .from('chatbots')
        .upsert({
          bot_id: bot.id,
          name: bot.name,
          title: bot.title,
          description: bot.description,
          title_avatar_src: bot.titleAvatarSrc,
          welcome_message: bot.welcomeMessage,
          error_message: bot.errorMessage,
          url: bot.url,
          placeholder: bot.placeholder,
          max_chars: bot.maxChars,
          max_chars_warning_message: bot.maxCharsWarningMessage,
          footer_text: bot.footerText,
          company_link: bot.companyLink,
          pinecone_index: bot.pineconeIndex,
          user_id: defaultUserId, // Setze den Default-User
          public: true, // Setze alle migrierten Chatbots als öffentlich
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'bot_id'
        });

      if (upsertError) {
        console.error(`Fehler beim Migrieren von Chatbot ${bot.id}:`, upsertError);
        throw new Error(`Fehler beim Migrieren von Chatbot ${bot.id}: ${upsertError.message}`);
      } else {
        console.log(`✓ Chatbot ${bot.id} erfolgreich migriert`);
      }
    }
    
    console.log('Migration erfolgreich abgeschlossen!');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Fehler bei der Migration der Chatbots:', error.message);
      throw error;
    } else {
      console.error('Unbekannter Fehler bei der Migration der Chatbots:', error);
      throw new Error('Unbekannter Fehler bei der Migration der Chatbots');
    }
  }
}

// Neue Funktion zum Aktualisieren des Chatbot-Besitzers
export async function updateChatbotOwner(botId: string, userId: string): Promise<void> {
  try {
    const { error } = await supabaseServer
      .from('chatbots')
      .update({ user_id: userId })
      .eq('bot_id', botId);

    if (error) {
      throw new Error(`Fehler beim Aktualisieren des Chatbot-Besitzers: ${error.message}`);
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Chatbot-Besitzers:', error);
    throw error;
  }
} 