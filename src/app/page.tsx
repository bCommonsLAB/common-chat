import RAGList from '@/components/RAGList';
import { AVAILABLE_RAGS } from '@/types/rag';

export default function HomePage() {
  return <RAGList rags={AVAILABLE_RAGS} />;
}