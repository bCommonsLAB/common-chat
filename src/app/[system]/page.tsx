import RAGInterface from '@/components/RAGInterface';

export default async function RAGPage({ params }: { params: { system: string } }) {
  return <RAGInterface system={params.system} />;
} 