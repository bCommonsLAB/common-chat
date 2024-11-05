"use client";

import React, { useState, useEffect } from 'react';
import { ChatMessage, RAGOption } from '@/types/rag';
import { ChatHistory } from './chat/ChatHistory';
import { SourcesView } from './sources/SourcesView';
import { MessageInput } from './chat/MessageInput';
import { useChatContext } from '@/context/ChatContext';

interface RAGInterfaceProps {
  chatContent: string;
  ragOption: RAGOption;
}

const RAGInterface: React.FC<RAGInterfaceProps> = ({ chatContent, ragOption }) => {
  const { 
    messages, 
    addMessage, 
    setCurrentRAG, 
    setChatContent, 
    clearChat 
  } = useChatContext();
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
  const [isMobileSourcesOpen, setIsMobileSourcesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    clearChat();
    setCurrentRAG(ragOption);
    setChatContent(chatContent);
  }, [chatContent, ragOption]);

  const handleToggleSources = (messageId: number) => {
    setActiveMessageId(messageId === activeMessageId ? null : messageId);
    setIsMobileSourcesOpen(true);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      role: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    addMessage(userMessage);
    setNewMessage("");

    try {
      const response = await fetch(`/api/rag/${chatContent}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage, pineconeIndex: ragOption.pineconeIndex }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      const messageId = messages.length + 2;
      const assistantMessage: ChatMessage = {
        id: messageId,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        sources: data.sources
      };

      addMessage(assistantMessage);
      setActiveMessageId(messageId);
      
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
      // Hier können Sie einen Fehlerstatus setzen und dem Nutzer anzeigen
    }
  };

  const activeSources = messages.find(m => m.id === activeMessageId)?.sources || [];

  // Handler zum Schließen der Quellen bei Klick auf den Chat
  const handleChatClick = () => {
    if (isMobileSourcesOpen) {
      setIsMobileSourcesOpen(false);
    }
  };

  // Initialisierung beim Laden
  useEffect(() => {
    // Prüfen ob bereits Nachrichten existieren
    if (messages.length === 0) {
      addMessage({
        id: 0,
        content: ragOption.welcomeMessage,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        sources: []
      });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px ist der übliche Breakpoint für Tablets/Mobile
    };

    // Initial check
    checkIsMobile();

    // Event Listener für Größenänderungen
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* chat/sources Bereich */}
      <div className="flex-1">
        <div className="flex flex-col h-full">
        {/* chat Bereich */}
          <div className="flex-1 overflow-y-auto">
            <ChatHistory 
              onToggleSources={handleToggleSources}
              activeMessageId={activeMessageId}
              onSourceClick={handleToggleSources}
            />
          </div>
          <div className="p-4 border-t">
            <MessageInput
              value={newMessage}
              onChange={setNewMessage}
              onSend={handleSendMessage}
            />
          </div>
        </div>
      </div>
      {/* Desktop Sources-Bereich */}
      {!isMobile && (
        <div className="flex-1">
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <SourcesView 
                sources={activeSources}
              />
            </div>
          </div>
        </div>
      )}
      {/* Mobile Sources-Bereich */}
      {isMobile && (
        <div className="flex-1 ml-4 mt-4 mb-4">
          <SourcesView 
            sources={activeSources}
            isMobile={true}
            isOpen={isMobileSourcesOpen}
            onClose={() => {
              setIsMobileSourcesOpen(false);
              setActiveMessageId(null);
            }}
          />
        </div>
      )}
  </div>
  );
};

export default RAGInterface;