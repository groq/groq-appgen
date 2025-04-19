import { NextRequest, NextResponse } from 'next/server';
import { parseActions } from '@/utils/action-parser';
import { ActionExecutor } from '@/utils/action-executor';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem não fornecida' },
        { status: 400 }
      );
    }

    // Extrair ações da mensagem
    const actions = parseActions(message);

    if (actions.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma ação encontrada na mensagem' },
        { status: 400 }
      );
    }

    // Criar executor de ações
    const executor = new ActionExecutor();

    // Executar ações
    await executor.executeActions(actions);

    // Obter resultados
    const steps = executor.getProgressTracker().getSteps();
    const files = Array.from(executor.getFileManager().getFiles().entries()).map(
      ([path, content]) => ({ path, content })
    );

    return NextResponse.json({
      success: true,
      steps,
      files
    });
  } catch (error) {
    console.error('Erro ao executar ações:', error);
    return NextResponse.json(
      { error: 'Falha ao executar ações' },
      { status: 500 }
    );
  }
}
