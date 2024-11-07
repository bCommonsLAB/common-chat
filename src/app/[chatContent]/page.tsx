'use client';

import { useParams } from 'next/navigation';
import RAGInterface from '@/components/RAGInterface';
import RAGList from '@/components/RAGList';
import { AVAILABLE_RAGS } from '@/types/rag';

export default function RAGPage() {
  const params = useParams();
  const chatContent = params.chatContent as string;
  const validRAGs = AVAILABLE_RAGS.map(rag => rag.id);
  const ragOption = AVAILABLE_RAGS.find(rag => rag.id === chatContent);
  
  return (
    <>
      {!validRAGs.includes(chatContent) || !ragOption ? (
        <RAGList rags={AVAILABLE_RAGS} />
      ) : (
        <RAGInterface chatContent={chatContent} ragOption={ragOption} />
      )}
    </>
  );
} 