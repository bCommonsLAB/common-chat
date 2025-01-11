'use client';

import { useParams } from 'next/navigation';
import RAGInterface from '@/components/RAGInterface';
import RAGList from '@/components/RAGList';
import { getAllChatbots } from '../actions/chatbots';
import { useEffect, useState } from 'react';
import { RAGOption } from '@/types/rag';
import { useAuth } from '@clerk/nextjs';

export default function RAGPage() {
  const params = useParams();
  const chatContent = params.chatContent as string;
  const [rags, setRags] = useState<RAGOption[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    getAllChatbots(userId || undefined)
      .then(chatbots => {
        console.log('Chatbots geladen:', chatbots);
        setRags(chatbots);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fehler beim Laden der Chatbots:', error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div>Lade Chatbots...</div>;
  }

  const validRAGs = rags.map(rag => rag.id);
  const ragOption = rags.find(rag => rag.id === chatContent);
  
  return (
    <>
      {!validRAGs.includes(chatContent) || !ragOption ? (
        <RAGList rags={rags} />
      ) : (
        <RAGInterface chatContent={chatContent} ragOption={ragOption} />
      )}
    </>
  );
} 