import React from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Message } from '@/types/rag';

interface ChatMessageProps {
  message: Message;
  onToggleSources: (messageId: number) => void;
  isSourcesShown: boolean;
  onSourceClick: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onToggleSources, isSourcesShown, onSourceClick }) => {
  if (message.isUser) {
    return (
      <div className="mb-4 flex justify-end">
        <div className="flex flex-col max-w-[90%]">
          <div className="bg-blue-600 text-white rounded-lg p-3">
            <p>{message.content}</p>
            <span className="text-xs opacity-75 mt-2 block">{message.timestamp}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex flex-col max-w-[90%]">
        <div className="bg-gray-100 rounded-lg p-3 relative">
          <p>{message.content}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">{message.timestamp}</span>
            {message.sources && (
              <button
                onClick={() => {
                  onToggleSources(message.id);
                  onSourceClick();
                }}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                <div className="relative flex items-center">
                  <BookOpen className="w-5 h-5" />
                  <span className="flex items-center justify-center bg-blue-600/80 text-white rounded-full w-4 h-4 text-[10px] -mt-3 -ml-1">
                    {message.sources.length}
                  </span>
                </div>
                {isSourcesShown ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 