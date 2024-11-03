import RAGInterface from '@/components/RAGInterface';

export default async function RAGPage({ params }: { params: { chatContent: string } }) {
  const chatContent = await params.chatContent;
  return <RAGInterface chatContent={chatContent} />;
} 