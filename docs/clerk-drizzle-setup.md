# Clerk Authentication und Drizzle DB Integration Guide

## 1. Clerk Authentication Setup

### 1.1 Installation
```bash
npm install @clerk/nextjs
```

### 1.2 Environment Variables
Erstellen Sie eine `.env.local` Datei:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 1.3 Middleware Setup
Erstellen Sie `middleware.ts` im Root-Verzeichnis:
```typescript
import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: ["/"]
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

### 1.4 Layout Anpassung
Aktualisieren Sie `src/app/layout.tsx`:
```typescript
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="de">
        <body>
          <div className="h-screen flex flex-col">
            <Header />
            <main className="flex-1 overflow-hidden">
              {children}
            </main>
            <MainFooter />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

## 2. Drizzle Setup für RAG-Optionen

### 2.1 Installation
```bash
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg
```

### 2.2 Drizzle Konfiguration
Erstellen Sie `drizzle.config.ts`:
```typescript
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### 2.3 Schema Definition
Erstellen Sie `src/db/schema.ts`:
```typescript
import { pgTable, serial, jsonb, text, timestamp } from 'drizzle-orm/pg-core';

export const ragOptions = pgTable('rag_options', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),  // Clerk User ID
  ragData: jsonb('rag_data').notNull(), // Speichert das gesamte RAG-Objekt
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Typ-Definition für RAG-Optionen
export type RAGOption = {
  id: string;
  title: string;
  description: string;
  url: string;
  // weitere Felder je nach Bedarf
};
```

### 2.4 Database Client
Erstellen Sie `src/lib/db.ts`:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/db/schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
```

### 2.5 API Route für RAG-Optionen
Erstellen Sie `src/app/api/rag-options/route.ts`:
```typescript
import { db } from '@/lib/db';
import { ragOptions } from '@/db/schema';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
  const { userId } = auth();
  
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const userRagOptions = await db.select()
      .from(ragOptions)
      .where(eq(ragOptions.userId, userId));

    return NextResponse.json(userRagOptions.map(option => option.ragData));
  } catch (error) {
    console.error('Database error:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = auth();
  
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const ragData = await req.json();
    
    await db.insert(ragOptions).values({
      userId,
      ragData,
    });

    return new NextResponse("RAG Option created", { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```

### 2.6 RAGList Komponente Anpassung
Aktualisieren Sie `src/components/RAGList.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { RAGOption } from '@/types/rag';

export default function RAGList() {
  const [rags, setRags] = useState<RAGOption[]>([]);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const fetchRagOptions = async () => {
      try {
        const response = await fetch('/api/rag-options');
        if (response.ok) {
          const data = await response.json();
          setRags(data);
        }
      } catch (error) {
        console.error('Error fetching RAG options:', error);
      }
    };

    if (isSignedIn) {
      fetchRagOptions();
    }
  }, [isSignedIn]);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold p-4 max-w-3xl mx-auto w-full">
        Verfügbare Chatbots
      </h1>
      <div className="flex-1 px-4">
        <div className="max-w-3xl mx-auto w-full">
          <div className="grid gap-4 pb-4">
            {rags.map((rag) => (
              <Link 
                href={rag.url} 
                key={rag.id}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2">{rag.title}</h2>
                <p className="text-gray-600">{rag.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 3. Migration der bestehenden RAG-Optionen

### 3.1 Migrations-Script
Erstellen Sie `scripts/migrate-rags.ts`:
```typescript
import { db } from '@/lib/db';
import { ragOptions } from '@/db/schema';
import { AVAILABLE_RAGS } from '@/types/rag';

async function migrateRags() {
  try {
    // Für jeden existierenden RAG in config.json
    for (const rag of AVAILABLE_RAGS) {
      await db.insert(ragOptions).values({
        userId: 'default', // Oder spezifische User-ID
        ragData: rag,
      });
    }
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
  process.exit(0);
}

migrateRags();
```

## 4. Nächste Schritte

1. Clerk Setup abschließen:
   - Account auf clerk.com erstellen
   - API Keys generieren und in .env.local einfügen
   - Sign-In/Sign-Up Pages erstellen

2. Datenbank Setup:
   - Supabase Connection String in .env.local einfügen:
     ```
     DATABASE_URL=postgres://postgres:[PASSWORD]@pgybzcgtmnifyamofuub.supabase.co:5432/postgres
     ```
   - Migrations ausführen:
     ```bash
     npx drizzle-kit generate:pg
     npx drizzle-kit push:pg
     ```
   - RAG-Optionen migrieren:
     ```bash
     npx tsx scripts/migrate-rags.ts
     ```

3. Testing:
   - Authentifizierung testen
   - RAG-Optionen Datenbankoperationen testen
   - Benutzer-spezifische RAG-Listen überprüfen