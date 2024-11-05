'use client';

import { RAGOption, ChatMessage } from '@/types/rag';
import { createContext, useContext, ReactNode, useState } from 'react';

interface ChatContextType {
  currentRAG: RAGOption | null;
  chatContent: string | null;
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  setCurrentRAG: (rag: RAGOption | null) => void;
  setChatContent: (content: string | null) => void;
}

const ChatContext = createContext<ChatContextType>({
  currentRAG: null,
  chatContent: null,
  messages: [],
  addMessage: () => {},
  clearChat: () => {},
  setCurrentRAG: () => {},
  setChatContent: () => {}
});

export const ChatProvider: React.FC<{
  children: ReactNode;
  initialRAG: RAGOption | null;
  initialContent: string | null;
}> = ({ children, initialRAG, initialContent }) => {
  const [currentRAG, setCurrentRAG] = useState<RAGOption | null>(initialRAG);
  const [chatContent, setChatContent] = useState<string | null>(initialContent);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{
      currentRAG,
      chatContent,
      messages,
      addMessage,
      clearChat,
      setCurrentRAG,
      setChatContent
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);