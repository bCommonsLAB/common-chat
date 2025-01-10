'use client';

import { useChatContext } from '@/context/ChatContext';
import { useRouter } from 'next/navigation';
import { SignInButton, UserButton, SignedIn, SignedOut, useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from 'react';
import { updateUserAccess } from '@/app/actions/users';

export function Header() {
  const { setCurrentRAG, setChatContent, clearChat } = useChatContext();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress;
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();

      if (email) {
        updateUserAccess(email, name).catch(error => {
          console.error('Fehler beim Aktualisieren des Benutzerzugriffs:', error);
        });
      }
    }
  }, [isSignedIn, user]);

  const handleHomeClick = () => {
    setCurrentRAG(null);
    setChatContent(null);
    clearChat();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-3 py-2 border-b bg-white">
      <div className="flex items-center">
        <Link href="/" onClick={handleHomeClick} className="text-xl font-bold">
          bCommonsLAB Chat
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
} 