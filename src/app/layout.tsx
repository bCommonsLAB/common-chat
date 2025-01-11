import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { ChatProvider } from '@/context/ChatContext';
import { Sidebar } from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "bCommonsLAB Prototypen",
  description: "powered by bCommonsLAB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="de">
        <body className={inter.className}>
          <ChatProvider initialRAG={null} initialContent={null}>
            <div className="flex h-screen flex-col">
              <Header />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-4">
                  {children}
                </main>
              </div>
            </div>
          </ChatProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
