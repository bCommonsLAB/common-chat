"use client";

import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Message } from '@/types/rag';
import { useSwipeable } from 'react-swipeable';
import { ChatHistory } from './chat/ChatHistory';
import { SourcesView } from './sources/SourcesView';
import { sendMessageToRAG, getInitialGreeting } from '@/services/ragService';
import { MessageInput } from './chat/MessageInput';

interface RAGInterfaceProps {
  system: string;
}

const RAGInterface: React.FC<RAGInterfaceProps> = ({ system }) => {
  console.log(system);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
  const [isMobileSourcesOpen, setIsMobileSourcesOpen] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => setIsMobileSourcesOpen(false),
    trackMouse: true
  });

  const handleToggleSources = (messageId: number) => {
    setActiveMessageId(messageId === activeMessageId ? null : messageId);
    setIsMobileSourcesOpen(true);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      content: newMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    try {
      const response = await sendMessageToRAG(newMessage, system);
        
      const assistantMessage: Message = {
        id: messages.length + 2,
        content: response.content,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        sources: response.sources
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Hier könnte man einen Error-State hinzufügen und dem Nutzer anzeigen
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
    const initializeChat = async () => {
      try {
        const greeting = await getInitialGreeting();
        setMessages([{
          id: 1,
          content: greeting.content,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          sources: greeting.sources
        }]);
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setIsLoading(false);
        setIsMobileSourcesOpen(false);
      }
    };

    initializeChat();
  }, []);

  return (
    <div className="flex h-screen max-h-screen bg-gray-50">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex w-full">
          {/* Chat-Bereich */}
          <div 
            className="w-1/2 flex flex-col h-screen"
            onClick={handleChatClick}
          >
            <ChatHistory 
              messages={messages}
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

          {/* Sources-Bereich */}
          <div className="w-1/2 border-l">
            {activeMessageId && <SourcesView sources={activeSources} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default RAGInterface;