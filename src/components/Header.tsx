'use client';

import { useChatContext } from '@/context/ChatContext';
import BreadcrumbPath from './BreadcrumbPath';
import { useRouter } from 'next/navigation';

export function Header() {
  const { currentRAG, chatContent, setCurrentRAG, setChatContent, clearChat } = useChatContext();
  const router = useRouter();

  const handleHomeClick = () => {
    // Reset des gesamten ChatContext
    setCurrentRAG(null);
    setChatContent(null);
    clearChat();
    router.push('/');
  };

  const breadcrumbItems = [
    { 
      label: 'Home', 
      href: '/', 
      onClick: handleHomeClick  // Home-Click Handler hinzufügen
    },
    ...(currentRAG ? [
      { 
        label: currentRAG.name, 
        href: `/chat/${chatContent}`
      }
    ] : [])
  ];

  return (
    <header className="p-4 bg-white border-b sticky top-0 z-10">
      <h1 className="text-2xl font-bold mb-2">
        {!currentRAG ? "bCommonsLAB Prototypen" : currentRAG.name}
      </h1>
      <p className="text-gray-600 mb-4">
        {!currentRAG ? "Zukunft gemeinsam erproben, Wissen teilen und solidarisch handeln." : currentRAG.description}
      </p>
      <BreadcrumbPath items={breadcrumbItems} />
    </header>
  );
} 