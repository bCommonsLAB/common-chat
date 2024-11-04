import React from 'react';
import { ChatMessageItem } from './ChatMessage';
import { MessageCircle } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';

interface ChatHistoryProps {
  activeMessageId: number | null;
  onToggleSources: (messageId: number) => void;
  onClick?: () => void;
  onSourceClick: (messageId: number) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  activeMessageId,
  onToggleSources,
  onClick,
  onSourceClick
}) => {
  const { messages } = useChatContext();
  
  return (
    <div 
      className="w-full flex flex-col border-r"
      onClick={onClick}
    >
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" /> Chat
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            onToggleSources={onToggleSources}
            isSourcesShown={message.id === activeMessageId}
            onSourceClick={() => onSourceClick(message.id)}
          />
        ))}
      </div>
    </div>
  );
}; 