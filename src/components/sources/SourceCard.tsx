import React from 'react';
import Image from 'next/image';
import { StructuredSource } from '@/types/rag';

interface SourceCardProps {
  source: StructuredSource;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source }) => (
  <div className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-3">
    <div className="flex gap-3">
      <div className="w-20 flex-shrink-0">
        {source.imageUrl && (
          <Image
            src={source.imageUrl}
          alt={source.title}
          width={100}
          height={128}
          className="w-full h-32 object-cover rounded-lg"
        />)}
        {source.metainfo && (
            <div className="mt-2 text-xs text-gray-500">
              {source.metainfo.map((item) => (
                <div key={item.key}>
                  {item.value}
                </div>
              ))}
              <div>Jahr: {source.year}</div>
            </div>
          )}
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
          {/* Seiten des Dokuments */}
          {source.pages && (
            <div className="mt-4">
              {source.pages.map((page) => (
                <div key={page.pageNumber} className="mb-3 border-l-2 border-gray-200 pl-3">
                  <div className="text-sm font-medium">Seite {page.pageNumber}</div>
                  <div className="text-sm text-gray-600">{page.excerpt}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
); 