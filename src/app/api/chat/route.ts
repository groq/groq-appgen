import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from '@/utils/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { messages, stream = false } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Mensagens não fornecidas ou formato inválido' },
        { status: 400 }
      );
    }

    if (stream) {
      // Streaming de resposta
      const responseStream = await generateResponse(messages, true) as ReadableStream;
      
      return new NextResponse(responseStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Resposta sem streaming
      const response = await generateResponse(messages, false) as string;
      
      return NextResponse.json({ response });
    }
  } catch (error) {
    console.error('Erro ao gerar resposta:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar resposta' },
      { status: 500 }
    );
  }
}
