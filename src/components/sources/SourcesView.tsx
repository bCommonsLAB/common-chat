import React from 'react';
import { StructuredSource } from '@/types/rag';
import { SourceCard } from './SourceCard';
import { BookOpen, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface SourcesViewProps {
  sources: StructuredSource[];
  className?: string;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onToggleSources?: (messageId: string | null) => void;
}

export const SourcesView: React.FC<SourcesViewProps> = ({
  sources,
  className,
  isMobile = false,
  isOpen = false,
  onClose,
  onToggleSources
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white/95 shadow-lg z-50 backdrop-blur-sm"
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Quellen
                </h2>
                <button 
                  onClick={() => {
                    onClose?.();
                    onToggleSources?.(null);
                  }}
                  className="p-2"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className={`hidden md:flex flex-col ${className || ''}`}>
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5" /> Quellen
        </h2>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm">
          Die generierte Antwort ist eine Synthese aus diesen Quellen, die wahrscheinlich mit der gestellten Frage in Bezug stehen
        </p>
      </div>
      {content}
    </div>
  );
}; 