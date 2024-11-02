import React from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  value, 
  onChange, 
  onSend 
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nachricht eingeben..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={onSend}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}; 