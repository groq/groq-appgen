import { NextRequest, NextResponse } from 'next/server';
import { speechToText } from '@/utils/speech-service';

export async function POST(request: NextRequest) {
  try {
    // Verificar se a requisição é multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Requisição deve ser multipart/form-data' },
        { status: 400 }
      );
    }

    // Obter o formulário
    const formData = await request.formData();
    
    // Obter o arquivo de áudio
    const audioFile = formData.get('file') as File;
    if (!audioFile) {
      return NextResponse.json(
        { error: 'Arquivo de áudio não fornecido' },
        { status: 400 }
      );
    }
    
    // Obter o idioma (opcional)
    const language = formData.get('language') as string | undefined;
    
    // Converter o arquivo para buffer
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    
    // Converter fala para texto
    const text = await speechToText(audioBuffer, language);
    
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Erro ao converter fala para texto:', error);
    return NextResponse.json(
      { error: 'Falha ao converter fala para texto' },
      { status: 500 }
    );
  }
}
