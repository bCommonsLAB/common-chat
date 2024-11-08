import type { Metadata } from "next";
import "./globals.css";
import { Header } from '@/components/Header';
import { MainFooter } from '@/components/MainFooter';

import { ChatProvider } from '@/context/ChatContext';

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
    <html lang="de">
      <body>
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
  );
}
