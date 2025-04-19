/**
 * Serviço de WebContainer
 * 
 * Este módulo fornece funções para execução de código no navegador usando WebContainer.
 */

import { WebContainer } from '@webcontainer/api';
import { FileTreeItem } from '@/types/file-types';

// Variável para armazenar a instância do WebContainer
let webcontainerInstance: WebContainer | null = null;

/**
 * Inicializa o WebContainer
 * @returns Instância do WebContainer
 */
export async function initWebContainer(): Promise<WebContainer> {
  if (!webcontainerInstance) {
    try {
      // Inicializar o WebContainer
      webcontainerInstance = await WebContainer.boot();
      console.log('WebContainer inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar WebContainer:', error);
      throw error;
    }
  }
  
  return webcontainerInstance;
}

/**
 * Converte a estrutura de arquivos para o formato do WebContainer
 * @param files Lista de arquivos
 * @returns Estrutura de arquivos no formato do WebContainer
 */
export function convertFilesToWebContainerFormat(files: FileTreeItem[]): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const file of files) {
    if (file.type === 'file') {
      result[file.name] = {
        file: {
          contents: file.content || '',
        },
      };
    } else if (file.type === 'directory' && file.children) {
      result[file.name] = {
        directory: convertFilesToWebContainerFormat(file.children),
      };
    }
  }
  
  return result;
}

/**
 * Cria arquivos no WebContainer
 * @param files Lista de arquivos
 * @returns Resultado da operação
 */
export async function createFiles(files: FileTreeItem[]): Promise<void> {
  try {
    const webcontainer = await initWebContainer();
    
    // Converter arquivos para o formato do WebContainer
    const webcontainerFiles = convertFilesToWebContainerFormat(files);
    
    // Criar arquivos no WebContainer
    await webcontainer.mount(webcontainerFiles);
    
    console.log('Arquivos criados com sucesso');
  } catch (error) {
    console.error('Erro ao criar arquivos:', error);
    throw error;
  }
}

/**
 * Executa um comando no WebContainer
 * @param command Comando a ser executado
 * @param options Opções de execução
 * @returns Resultado da execução
 */
export async function executeCommand(
  command: string,
  options: { cwd?: string } = {}
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  try {
    const webcontainer = await initWebContainer();
    
    // Executar comando
    const process = await webcontainer.spawn(command.split(' '), {
      cwd: options.cwd,
    });
    
    // Capturar saída
    let stdout = '';
    let stderr = '';
    
    process.output.pipeTo(
      new WritableStream({
        write(data) {
          stdout += data;
        },
      })
    );
    
    process.stderr.pipeTo(
      new WritableStream({
        write(data) {
          stderr += data;
        },
      })
    );
    
    // Aguardar conclusão
    const exitCode = await process.exit;
    
    return { exitCode, stdout, stderr };
  } catch (error) {
    console.error('Erro ao executar comando:', error);
    throw error;
  }
}

/**
 * Inicia um servidor no WebContainer
 * @param command Comando para iniciar o servidor
 * @param options Opções de execução
 * @returns URL do servidor
 */
export async function startServer(
  command: string,
  options: { cwd?: string; port?: number } = {}
): Promise<string> {
  try {
    const webcontainer = await initWebContainer();
    
    // Executar comando
    const process = await webcontainer.spawn(command.split(' '), {
      cwd: options.cwd,
    });
    
    // Aguardar servidor estar pronto
    await process.ready;
    
    // Obter URL do servidor
    const port = options.port || 3000;
    const url = await webcontainer.iframe.setPort(port);
    
    return url;
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    throw error;
  }
}
