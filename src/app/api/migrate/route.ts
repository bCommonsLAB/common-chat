import { migrateChatbotsFromConfig } from '@/app/actions/chatbots';
import { AVAILABLE_RAGS } from '@/types/rag';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await migrateChatbotsFromConfig(AVAILABLE_RAGS);
    return NextResponse.json({ 
      success: true, 
      message: 'Migration erfolgreich durchgeführt' 
    });
  } catch (error) {
    console.error('Fehler bei der Migration:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unbekannter Fehler' 
    }, { 
      status: 500 
    });
  }
} 