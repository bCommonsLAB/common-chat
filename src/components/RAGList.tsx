import { RAGOption } from '@/types/rag';
import Link from 'next/link';

export default function RAGList({ rags }: { rags: RAGOption[] }) {
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