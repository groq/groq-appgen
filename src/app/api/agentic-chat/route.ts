import { NextRequest, NextResponse } from 'next/server';
import { generateAgenticResponse, generateAgenticMiniResponse } from '@/utils/agentic-service';

export async function POST(request: NextRequest) {
  try {
    const { messages, stream = false, mini = false } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Mensagens não fornecidas ou formato inválido' },
        { status: 400 }
      );
    }

    if (stream) {
      // Streaming de resposta
      const responseStream = mini 
        ? await generateAgenticMiniResponse(messages, true)
        : await generateAgenticResponse(messages, true);
      
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
            
            // Se houver tool_calls, enviar também
            const toolCalls = chunk.choices[0]?.delta?.tool_calls;
            if (toolCalls) {
              await writer.write(encoder.encode(`data: ${JSON.stringify({ tool_calls: toolCalls })}\n\n`));
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
      const response = mini 
        ? await generateAgenticMiniResponse(messages, false)
        : await generateAgenticResponse(messages, false);
      
      return NextResponse.json({ 
        response: response.choices[0].message.content,
        tool_calls: response.choices[0].message.tool_calls
      });
    }
  } catch (error) {
    console.error('Erro ao gerar resposta com Agentic Tooling:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar resposta com Agentic Tooling' },
      { status: 500 }
    );
  }
}
