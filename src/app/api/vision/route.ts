import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage, analyzeImageWithTools } from '@/utils/vision-service';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, prompt, tools, stream = false } = await request.json();

    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: 'URL da imagem e prompt são obrigatórios' },
        { status: 400 }
      );
    }

    if (tools && Array.isArray(tools)) {
      // Analisar imagem com ferramentas
      const response = await analyzeImageWithTools(imageUrl, prompt, tools);
      
      return NextResponse.json({
        response: response.choices[0].message.content,
        tool_calls: response.choices[0].message.tool_calls
      });
    } else if (stream) {
      // Streaming de resposta
      const responseStream = await analyzeImage(imageUrl, prompt, true);
      
      // Criar um stream de resposta
      const encoder = new TextEncoder();
      const transformStream = new TransformStream();
      const writer = transformStream.writable.getWriter();
      
      // Processar o stream
      (async () => {
        try {
          for await (const chunk of responseStream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              await writer.write(encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`));
            }
          }
          await writer.close();
        } catch (error) {
          console.error('Erro no streaming:', error);
          await writer.abort(error instanceof Error ? error : new Error(String(error)));
        }
      })();
      
      return new NextResponse(transformStream.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Resposta sem streaming
      const response = await analyzeImage(imageUrl, prompt, false);
      
      return NextResponse.json({ 
        response: response.choices[0].message.content
      });
    }
  } catch (error) {
    console.error('Erro ao analisar imagem:', error);
    return NextResponse.json(
      { error: 'Falha ao analisar imagem' },
      { status: 500 }
    );
  }
}
