import { NextRequest, NextResponse } from 'next/server';
import { PineconeService } from '@/services/pineconeService';

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

    // Initialisiere Service
    const pineconeService = await PineconeService.create()
      .catch(error => {
        console.error('Failed to initialize PineconeService:', error);
        throw new Error('Service initialization failed');
      });

    // Verarbeite Anfrage
    const response = await pineconeService.query(body.message, params.chatContent);
    
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