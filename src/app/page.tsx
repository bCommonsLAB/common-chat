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
      try {
        // Lade Chatbots aus der Datenbank mit Berücksichtigung des Benutzer-Status
        const loadedChatbots = await getAllChatbots(user?.emailAddresses[0]?.emailAddress);
        setChatbots(loadedChatbots);
      } catch (error) {
        console.error('Fehler beim Laden der Chatbots:', error);
        // Fallback auf die config.json wenn die Datenbank nicht verfügbar ist
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
    return <div>Lade...</div>;
  }

  return <RAGList rags={chatbots} />;
}