'use client';

import { useChatContext } from '@/context/ChatContext';
import BreadcrumbPath from './BreadcrumbPath';

export function Header() {
  const { currentRAG } = useChatContext();

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...(currentRAG ? [{ label: currentRAG.name, href: '#' }] : [])
  ];

  return (
    <header className="p-4 bg-white border-b">
      <h1 className="text-2xl font-bold mb-2">
        {!currentRAG ? "Chatbots Prototypen" : currentRAG.name}
      </h1>
      {currentRAG && <p className="text-gray-600 mb-4">{currentRAG.description}</p>}
      <BreadcrumbPath items={breadcrumbItems} />
    </header>
  );
} 