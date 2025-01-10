'use client';

import { RAGOption } from '@/types/rag';
import Link from 'next/link';
import { useState } from 'react';

export default function RAGList({ rags }: { rags: RAGOption[] }) {
  const [migrationStatus, setMigrationStatus] = useState<string>('');

  const handleMigration = async () => {
    try {
      setMigrationStatus('Migration läuft...');
      const response = await fetch('/api/migrate');
      const data = await response.json();
      
      if (data.success) {
        setMigrationStatus(`Migration erfolgreich: ${data.migratedBots.length} Chatbots migriert`);
      } else {
        setMigrationStatus(`Fehler: ${data.error}`);
      }
    } catch (error) {
      setMigrationStatus('Fehler bei der Migration');
      console.error('Migrationsfehler:', error);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto h-full">
      <div className="flex justify-between items-center p-4 max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-bold">Verfügbare Chatbots</h1>
        <div>
          <button
            onClick={handleMigration}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Chatbots migrieren
          </button>
          {migrationStatus && (
            <p className="mt-2 text-sm text-gray-600">{migrationStatus}</p>
          )}
        </div>
      </div>
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