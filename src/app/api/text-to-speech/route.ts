import { NextRequest, NextResponse } from 'next/server';
import { textToSpeech } from '@/utils/speech-service';

export async function POST(request: NextRequest) {
  try {
    const { text, voice } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Texto não fornecido' },
        { status: 400 }
      );
    }

    // Converter texto para fala
    const audioBuffer = await textToSpeech(text, voice);
    
    // Retornar o áudio como resposta
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Disposition': 'attachment; filename="speech.wav"',
      },
    });
  } catch (error) {
    console.error('Erro ao converter texto para fala:', error);
    return NextResponse.json(
      { error: 'Falha ao converter texto para fala' },
      { status: 500 }
    );
  }
}
