import { RAGOption } from '@/types/rag';
import Link from 'next/link';

export default function RAGList({ rags }: { rags: RAGOption[] }) {
  return (
    <div className="flex flex-col space-y-4 p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Verfügbare Chatbots</h1>
      <div className="grid gap-4">
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
  );
} 