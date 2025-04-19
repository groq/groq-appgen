import { NextRequest, NextResponse } from 'next/server';
import { createFiles, executeCommand, startServer } from '@/utils/web-container-service';
import { FileTreeItem } from '@/types/file-types';

export async function POST(request: NextRequest) {
  try {
    const { action, files, command, options } = await request.json();

    switch (action) {
      case 'create-files':
        if (!files || !Array.isArray(files)) {
          return NextResponse.json(
            { error: 'Arquivos não fornecidos ou formato inválido' },
            { status: 400 }
          );
        }

        // Criar arquivos
        await createFiles(files as FileTreeItem[]);
        
        return NextResponse.json({ success: true });

      case 'execute-command':
        if (!command) {
          return NextResponse.json(
            { error: 'Comando não fornecido' },
            { status: 400 }
          );
        }

        // Executar comando
        const result = await executeCommand(command, options);
        
        return NextResponse.json(result);

      case 'start-server':
        if (!command) {
          return NextResponse.json(
            { error: 'Comando não fornecido' },
            { status: 400 }
          );
        }

        // Iniciar servidor
        const url = await startServer(command, options);
        
        return NextResponse.json({ url });

      default:
        return NextResponse.json(
          { error: 'Ação inválida' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Erro ao executar ação no WebContainer:', error);
    return NextResponse.json(
      { error: 'Falha ao executar ação no WebContainer' },
      { status: 500 }
    );
  }
}
