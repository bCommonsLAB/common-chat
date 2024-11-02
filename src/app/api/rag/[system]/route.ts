import { NextRequest, NextResponse } from 'next/server';
import { sendMessageToRAG } from '@/services/ragService';

export async function POST(
  request: NextRequest,
  { params }: { params: { system: string } }
) {
  try {
    const { message } = await request.json();
    const response = await sendMessageToRAG(message, params.system);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in RAG API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 