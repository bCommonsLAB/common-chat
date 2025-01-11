'use client';

import RAGList from '@/components/RAGList';
import { getAllChatbots } from './actions/chatbots';
import { AVAILABLE_RAGS } from '@/types/rag';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { RAGOption } from '@/types/rag';

export default function HomePage() {
  const { isLoaded, user } = useUser();
  const [chatbots, setChatbots] = useState<RAGOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChatbots() {
      console.log('Client: Starte Laden der Chatbots...');
      console.log('Client: Benutzer-Status:', isLoaded ? (user ? 'Angemeldet' : 'Nicht angemeldet') : 'Lädt...');
      
      try {
        const userEmail = user?.emailAddresses[0]?.emailAddress;
        console.log('Client: Versuche Chatbots zu laden für:', userEmail || 'Anonym');
        
        const loadedChatbots = await getAllChatbots(userEmail);
        console.log('Client: Chatbots geladen:', loadedChatbots.length);
        setChatbots(loadedChatbots);
      } catch (error) {
        console.error('Client: Fehler beim Laden der Chatbots:', error);
        console.log('Client: Verwende Fallback-Chatbots aus AVAILABLE_RAGS');
        setChatbots(AVAILABLE_RAGS);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      loadChatbots();
    }
  }, [isLoaded, user?.emailAddresses]);

  if (!isLoaded || loading) {
    return <div className="flex items-center justify-center h-full">Lade...</div>;
  }

  return (
    <div className="container mx-auto">
      <RAGList rags={chatbots} />
    </div>
  );
}