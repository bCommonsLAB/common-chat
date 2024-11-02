import Image from 'next/image';
import { Source } from '@/types/rag';

interface SourcesProps {
  sources: Source[];
}

export const Sources: React.FC<SourcesProps> = ({ sources }) => {
  return (
    <div className="space-y-4">
      {sources.map((source, index) => (
        <div key={index} className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
          {source.imageUrl ? (
            <div className="relative w-[100px] h-[128px] flex-shrink-0">
              <Image
                src={source.imageUrl}
                alt={source.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="w-[100px] h-[128px] bg-gray-100 rounded-lg flex-shrink-0" />
          )}
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{source.title}</h3>
            <p className="text-sm text-gray-600">von {source.author}</p>
            <p className="mt-2 text-sm italic">&ldquo;{source.excerpt}&rdquo;</p>
          </div>
        </div>
      ))}
    </div>
  );
}; 