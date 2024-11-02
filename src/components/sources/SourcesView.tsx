import React from 'react';
import { Source } from '@/types/rag';
import { SourceCard } from './SourceCard';
import { BookOpen, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SourcesViewProps {
  sources: Source[];
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
  swipeHandlers?: Record<string, unknown>;
}

export const SourcesView: React.FC<SourcesViewProps> = ({
  sources,
  className,
  isMobile = false,
  onClose,
  swipeHandlers = {}
}) => {
  const content = (
    <div className="flex-1 overflow-y-auto p-4">
      {sources.length > 0 ? (
        <div className="space-y-3">
          {sources.map((source, index) => (
            <SourceCard key={index} source={source} />
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center mt-8">
          Wählen Sie eine Nachricht aus, um die zugehörigen Quellen anzuzeigen
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <motion.div
        {...swipeHandlers}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-[5%] bottom-[5%] right-0 w-[90%] md:hidden bg-white/95 shadow-lg z-50 backdrop-blur-sm rounded-l-xl"
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Quellen
            </h2>
            <button 
              onClick={onClose}
              className="p-2"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          {content}
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`hidden md:flex flex-col ${className || ''}`}>
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5" /> Quellen
        </h2>
      </div>
      {content}
    </div>
  );
}; 