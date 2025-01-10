'use client';

import { useChatContext } from '@/context/ChatContext';
import BreadcrumbPath from './BreadcrumbPath';
import { useRouter } from 'next/navigation';
import { SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

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
    <header className="sticky top-0 z-50 flex items-center justify-between px-3 py-2 border-b bg-white">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold">
          bCommonsLAB Chat
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <SignInButton mode="modal">
          <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800">
            Sign In
          </button>
        </SignInButton>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
} 