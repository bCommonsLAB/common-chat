'use client';

import { RAGOption, ChatMessage } from '@/types/rag';
import { createContext, useContext, ReactNode, useState } from 'react';


interface ChatContextType {
  currentRAG: RAGOption | null;
  chatContent: string | null;
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType>({
  currentRAG: null,
  chatContent: null,
  messages: [],
  addMessage: () => {},
  clearChat: () => {}
});

export const ChatProvider: React.FC<{
  children: ReactNode;
  initialRAG: RAGOption | null;
  initialContent: string | null;
}> = ({ children, initialRAG, initialContent }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (message: ChatMessage) => {
    console.log("addMessage", message);
    setMessages(prev => [...prev, message]);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{
      currentRAG: initialRAG,
      chatContent: initialContent,
      messages,
      addMessage,
      clearChat
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => useContext(ChatContext); 