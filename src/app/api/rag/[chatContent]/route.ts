import { NextRequest, NextResponse } from 'next/server';
import { PineconeService } from '@/services/pineconeService';
// import { sendMessageToFlowise } from '@/services/ragService';

export async function POST(
  request: NextRequest,
  { params }: { params: { chatContent: string } }
) {
  try {
    // Validiere request body
    const body = await request.json();
    if (!body.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    if (!body.pineconeIndex) {
      return NextResponse.json(
        { error: 'pineconeIndex is required' },
        { status: 400 }
      );
    } 
    const pineconeIndex = body.pineconeIndex;
    const chatContent = (await params)?.chatContent;

    // FLOWISE Version
    // const flowiseResponse = await sendMessageToFlowise(body.message, chatContent);
    // return NextResponse.json(flowiseResponse);

    // PINECONE Version
    // Initialisiere Service
    const pineconeService = await PineconeService.create(pineconeIndex)
      .catch(error => {
        console.error('Failed to initialize PineconeService:', error);
        throw new Error('Service initialization failed');
      });

    const response = await pineconeService.query(body.message, chatContent);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in RAG API:', error);
    
    // Bessere Fehlermeldungen
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    const status = error instanceof Error && error.message === 'Message is required' ? 400 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
} 