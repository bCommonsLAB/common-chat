"use client";

// src/components/RAGInterface.tsx

import React, { useState } from 'react';
import { Send, BookOpen, MessageCircle, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { Message, Source } from '@/types/rag';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

// Chat-Nachricht Komponente
interface ChatMessageProps {
  message: Message;
  onToggleSources: (messageId: number) => void;
  isSourcesShown: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onToggleSources, isSourcesShown }) => {
  if (message.isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
          <p>{message.content}</p>
          <span className="text-xs opacity-75 mt-1 block">
            {message.timestamp}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex flex-col max-w-[80%]">
        <div className="bg-gray-100 rounded-lg p-3 relative">
          <p>{message.content}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">{message.timestamp}</span>
            {message.sources && (
              <button
                onClick={() => onToggleSources(message.id)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                {isSourcesShown ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Quellen-Karte Komponente
interface SourceCardProps {
  source: Source;
}

const SourceCard: React.FC<SourceCardProps> = ({ source }) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-3">
    <div className="flex gap-3">
      <div className="w-1/3 max-w-[100px] flex-shrink-0">
        <Image
          src={source.imageUrl}
          alt={source.title}
          width={100}
          height={128}
          className="w-full h-32 object-cover rounded-lg"
        />
      </div>
      <div className="flex-grow min-w-0">
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-base leading-tight">
              {source.title}
            </h3>
            <p className="text-gray-600 text-sm">
              von {source.author}
            </p>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 italic">
            &quot;{source.excerpt}&quot;
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Initial Messages für Demo
const initialMessages: Message[] = [
  {
    id: 1,
    content: "Wie kann ich meine Produktivität steigern?",
    isUser: true,
    timestamp: "10:00"
  },
  {
    id: 2,
    content: "Basierend auf den verfügbaren Quellen gibt es mehrere bewährte Methoden zur Produktivitätssteigerung. Die Pomodoro-Technik und ein strukturierter Tagesablauf haben sich als besonders effektiv erwiesen. Regelmäßige Pausen und die Priorisierung von wichtigen Aufgaben am Morgen sind dabei zentrale Elemente.",
    isUser: false,
    timestamp: "10:01",
    sources: [
      {
        title: "Produktivität im digitalen Zeitalter",
        author: "Dr. Maria Schmidt",
        imageUrl: "/api/placeholder/150/200",
        excerpt: "Die Pomodoro-Technik hat sich als besonders effektiv erwiesen. Studien zeigen, dass regelmäßige Pausen die Konzentrationsfähigkeit deutlich verbessern können. Durch strukturierte 25-Minuten-Arbeitsphasen wird nicht nur die Konzentration gefördert, sondern auch die Motivation aufrechterhalten.",
      },
      {
        title: "Zeitmanagement für Profis",
        author: "Thomas Weber",
        imageUrl: "/api/placeholder/150/200",
        excerpt: "Ein gut strukturierter Tagesablauf ist der Schlüssel zum Erfolg. Beginnen Sie mit den wichtigsten Aufgaben am Morgen, wenn Ihre Energie am höchsten ist. Die 2-Minuten-Regel besagt, dass Aufgaben, die weniger als zwei Minuten benötigen, sofort erledigt werden sollten.",
      }
    ]
  },
  {
    id: 3,
    content: "Wie kann ich besser schlafen?",
    isUser: true,
    timestamp: "10:15"
  },
  {
    id: 4,
    content: "Für einen besseren Schlaf empfehlen Experten eine regelmäßige Schlafenszeit, die Vermeidung von Bildschirmen vor dem Schlafengehen und die Schaffung einer ruhigen Schlafumgebung. Auch leichte Entspannungsübungen können sehr hilfreich sein.",
    isUser: false,
    timestamp: "10:16",
    sources: [
      {
        title: "Gesunder Schlaf - Der ultimative Guide",
        author: "Prof. Dr. Anna Müller",
        imageUrl: "/api/placeholder/150/200",
        excerpt: "Ein regelmäßiger Schlafrhythmus ist der wichtigste Faktor für erholsamen Schlaf. Der Körper gewöhnt sich an feste Zeiten und kann sich besser auf die Ruhephase einstellen. Vermeiden Sie intensive Bildschirmnutzung mindestens eine Stunde vor dem Schlafengehen.",
      },
      {
        title: "Schlafoptimierung im Alltag",
        author: "Michael Berg",
        imageUrl: "/api/placeholder/150/200",
        excerpt: "Entspannungsübungen wie progressive Muskelentspannung oder Atemtechniken können die Einschlafzeit deutlich verkürzen. Eine kühle, dunkle und ruhige Schlafumgebung unterstützt den natürlichen Schlaf-Wach-Rhythmus.",
      }
    ]
  },
  {
    id: 5,
    content: "Was sind die besten Methoden zum Stressabbau?",
    isUser: true,
    timestamp: "10:30"
  },
  {
    id: 6,
    content: "Effektive Methoden zum Stressabbau umfassen regelmäßige Bewegung, Meditation und bewusstes Atmen. Auch das Führen eines Dankbarkeitstagebuchs und ausreichend Zeit in der Natur können Stress deutlich reduzieren.",
    isUser: false,
    timestamp: "10:31",
    sources: [
      {
        title: "Stressbewältigung im modernen Leben",
        author: "Dr. Sarah Klein",
        imageUrl: "/api/placeholder/150/200",
        excerpt: "Bereits 15 Minuten Bewegung täglich können Stresshormone signifikant reduzieren. Die Kombination aus leichtem Sport und Aufenthalt in der Natur zeigt besonders positive Effekte auf das mentale Wohlbefinden.",
      },
      {
        title: "Meditation für Anfänger",
        author: "Lisa Wagner",
        imageUrl: "/api/placeholder/150/200",
        excerpt: "Tägliche Meditation, auch wenn nur für 5-10 Minuten, kann die Stressresistenz erheblich verbessern. Die Fokussierung auf den Atem ist dabei eine der effektivsten Techniken für Einsteiger.",
      }
    ]
  }
];

// Hauptkomponente
const RAGInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
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

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: messages.length + 1,
      content: newMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const activeSources = messages.find(m => m.id === activeMessageId)?.sources || [];

  return (
    <div className="flex h-screen max-h-screen bg-gray-50">
      {/* Chat-Spalte - jetzt volle Breite auf Mobile */}
      <div className="w-full md:w-1/2 flex flex-col border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Chat
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onToggleSources={handleToggleSources}
              isSourcesShown={message.id === activeMessageId}
            />
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 rounded-lg border p-2"
              placeholder="Schreiben Sie eine Nachricht..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white rounded-lg p-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Quellen */}
      <div className="hidden md:flex w-1/2 flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Quellen
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {activeSources.length > 0 ? (
            <div className="space-y-3">
              {activeSources.map((source, index) => (
                <SourceCard key={index} source={source} />
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center mt-8">
              Wählen Sie eine Nachricht aus, um die zugehörigen Quellen anzuzeigen
            </div>
          )}
        </div>
      </div>

      {/* Mobile Quellen Overlay */}
      <AnimatePresence>
        {isMobileSourcesOpen && (
          <motion.div
            {...swipeHandlers}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-3/4 md:hidden bg-white shadow-lg z-50"
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Quellen
                </h2>
                <button 
                  onClick={() => setIsMobileSourcesOpen(false)}
                  className="p-2"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {activeSources.length > 0 ? (
                  <div className="space-y-3">
                    {activeSources.map((source, index) => (
                      <SourceCard key={index} source={source} />
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center mt-8">
                    Wählen Sie eine Nachricht aus, um die zugehörigen Quellen anzuzeigen
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RAGInterface;