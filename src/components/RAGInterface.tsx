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
  const { messages: contextMessages, addMessage } = useChatContext();
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
  const [isMobileSourcesOpen, setIsMobileSourcesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleToggleSources = (messageId: number) => {
    setActiveMessageId(messageId === activeMessageId ? null : messageId);
    setIsMobileSourcesOpen(true);
  };

  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    

    const userMessage: ChatMessage = {
      id: contextMessages.length + 1,
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
        body: JSON.stringify({ message: newMessage }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      const messageId = contextMessages.length + 2;
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

  const activeSources = contextMessages.find(m => m.id === activeMessageId)?.sources || [];

  // Handler zum Schließen der Quellen bei Klick auf den Chat
  const handleChatClick = () => {
    if (isMobileSourcesOpen) {
      setIsMobileSourcesOpen(false);
    }
  };

  // Initialisierung beim Laden
  useEffect(() => {
    addMessage({
      id: 1,
      content: ragOption.welcomeMessage,
      role: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sources: []
    });
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
    <div className="flex h-screen max-h-screen bg-gray-50">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex w-full">
          {/* Chat-Bereich */}
          <div 
            className="w-full md:w-1/2 flex flex-col h-screen"
            onClick={handleChatClick}
          >
            <ChatHistory 
              onToggleSources={handleToggleSources}
              activeMessageId={activeMessageId}
              onSourceClick={handleToggleSources}
            />
            
            <MessageInput
              value={newMessage}
              onChange={setNewMessage}
              onSend={handleSendMessage}
            />
          </div>

          {/* Desktop Sources-Bereich */}
          <div className="hidden md:block md:w-1/2 border-l">
            <SourcesView 
              sources={activeSources} 
              className="h-full"
            />
          </div>
        </div>
      )}

      {/* Mobile Sources-Bereich */}
      {isMobile && (
        <SourcesView 
          sources={activeSources}
          isMobile={true}
          isOpen={isMobileSourcesOpen}
          onClose={() => {
            setIsMobileSourcesOpen(false);
            setActiveMessageId(null);
          }}
        />
      )}
    </div>
  );
};

export default RAGInterface;