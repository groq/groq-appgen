import { NextRequest, NextResponse } from 'next/server';
import { executeCode, generateAndExecuteCode } from '@/utils/code-execution-service';

export async function POST(request: NextRequest) {
  try {
    const { code, language, description, mode = 'execute' } = await request.json();

    if (mode === 'execute') {
      if (!code) {
        return NextResponse.json(
          { error: 'Código não fornecido' },
          { status: 400 }
        );
      }

      // Executar código
      const result = await executeCode(code, language);
      
      return NextResponse.json({ result });
    } else if (mode === 'generate') {
      if (!description) {
        return NextResponse.json(
          { error: 'Descrição não fornecida' },
          { status: 400 }
        );
      }

      // Gerar e executar código
      const { code, result } = await generateAndExecuteCode(description, language);
      
      return NextResponse.json({ code, result });
    } else {
      return NextResponse.json(
        { error: 'Modo inválido' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erro ao executar código:', error);
    return NextResponse.json(
      { error: 'Falha ao executar código' },
      { status: 500 }
    );
  }
}
