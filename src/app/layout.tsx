import type { Metadata } from "next";
import "./globals.css";
import { MainFooter } from '@/components/MainFooter';
import { ChatProvider } from '@/context/ChatContext';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';

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
          <ChatProvider 
            initialRAG={null}
            initialContent={null}
          >
            <div className="h-screen flex flex-col">
              <Header />
              <main className="flex-1 overflow-hidden">
                {children}
              </main>
              <MainFooter />
            </div>
          </ChatProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
