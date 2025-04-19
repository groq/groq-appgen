/**
 * Action Executor
 * 
 * Este módulo fornece funções para executar ações extraídas de mensagens da IA.
 * As ações podem ser de diferentes tipos, como criação de arquivos ou execução de comandos.
 */

import { Action } from './action-parser';
import { EventEmitter } from 'events';

// Emissor de eventos para comunicação com o frontend
export const actionEventEmitter = new EventEmitter();

export interface Step {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'complete' | 'failed';
  description?: string;
  code?: string;
  error?: string;
}

/**
 * Gerenciador de arquivos
 */
export class FileManager {
  private files: Map<string, string> = new Map();
  
  /**
   * Cria ou atualiza um arquivo
   * @param path Caminho do arquivo
   * @param content Conteúdo do arquivo
   */
  async createFile(path: string, content: string): Promise<void> {
    // Criar diretórios necessários
    const dir = path.substring(0, path.lastIndexOf('/'));
    if (dir) {
      await this.createDirectory(dir);
    }
    
    // Salvar o arquivo
    this.files.set(path, content);
    
    // Em um ambiente real, aqui escreveríamos no sistema de arquivos
    // await fs.promises.writeFile(path, content);
    
    return Promise.resolve();
  }
  
  /**
   * Cria um diretório
   * @param path Caminho do diretório
   */
  async createDirectory(path: string): Promise<void> {
    // Em um ambiente real, aqui criaríamos o diretório
    // await fs.promises.mkdir(path, { recursive: true });
    
    return Promise.resolve();
  }
  
  /**
   * Executa um comando no terminal
   * @param command Comando a ser executado
   * @returns Saída do comando
   */
  async executeShellCommand(command: string): Promise<string> {
    // Em um ambiente real, aqui executaríamos o comando
    // return new Promise((resolve, reject) => {
    //   exec(command, (error, stdout, stderr) => {
    //     if (error) {
    //       reject(error);
    //       return;
    //     }
    //     resolve(stdout);
    //   });
    // });
    
    // Simulação de execução de comando
    console.log(`Executando comando: ${command}`);
    return Promise.resolve(`Saída do comando: ${command}`);
  }
  
  /**
   * Obtém todos os arquivos
   * @returns Mapa de arquivos
   */
  getFiles(): Map<string, string> {
    return this.files;
  }
  
  /**
   * Obtém um arquivo
   * @param path Caminho do arquivo
   * @returns Conteúdo do arquivo
   */
  getFile(path: string): string | undefined {
    return this.files.get(path);
  }
}

/**
 * Rastreador de progresso
 */
export class ProgressTracker {
  private steps: Step[] = [];
  
  /**
   * Adiciona um passo
   * @param id ID do passo
   * @param title Título do passo
   * @param description Descrição do passo
   */
  addStep(id: string, title: string, description?: string): void {
    this.steps.push({
      id,
      title,
      status: 'pending',
      description
    });
    this.emitUpdate();
  }
  
  /**
   * Inicia um passo
   * @param id ID do passo
   */
  startStep(id: string): void {
    const step = this.steps.find(s => s.id === id);
    if (step) {
      step.status = 'running';
      this.emitUpdate();
    }
  }
  
  /**
   * Completa um passo
   * @param id ID do passo
   * @param code Código gerado (opcional)
   */
  completeStep(id: string, code?: string): void {
    const step = this.steps.find(s => s.id === id);
    if (step) {
      step.status = 'complete';
      if (code) {
        step.code = code;
      }
      this.emitUpdate();
    }
  }
  
  /**
   * Falha um passo
   * @param id ID do passo
   * @param error Erro ocorrido
   */
  failStep(id: string, error: string): void {
    const step = this.steps.find(s => s.id === id);
    if (step) {
      step.status = 'failed';
      step.error = error;
      this.emitUpdate();
    }
  }
  
  /**
   * Obtém todos os passos
   * @returns Lista de passos
   */
  getSteps(): Step[] {
    return this.steps;
  }
  
  /**
   * Emite atualização de progresso
   */
  private emitUpdate(): void {
    actionEventEmitter.emit('progress-update', this.steps);
  }
}

/**
 * Executor de ações
 */
export class ActionExecutor {
  private fileManager: FileManager;
  private progressTracker: ProgressTracker;
  
  constructor() {
    this.fileManager = new FileManager();
    this.progressTracker = new ProgressTracker();
  }
  
  /**
   * Executa uma lista de ações
   * @param actions Lista de ações
   */
  async executeActions(actions: Action[]): Promise<void> {
    // Adicionar passos ao rastreador de progresso
    actions.forEach((action, index) => {
      const id = `action-${index}`;
      const title = action.type === 'file' 
        ? `Criando arquivo: ${action.filePath}` 
        : `Executando: ${action.content.substring(0, 30)}${action.content.length > 30 ? '...' : ''}`;
      
      const description = action.type === 'file'
        ? `Criando arquivo ${action.filePath} com ${action.content.length} caracteres`
        : `Executando comando: ${action.content}`;
      
      this.progressTracker.addStep(id, title, description);
    });
    
    // Executar ações sequencialmente
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const id = `action-${i}`;
      
      this.progressTracker.startStep(id);
      
      try {
        if (action.type === 'file' && action.filePath) {
          await this.fileManager.createFile(action.filePath, action.content);
          this.progressTracker.completeStep(id, action.content);
        } else if (action.type === 'shell') {
          const output = await this.fileManager.executeShellCommand(action.content);
          this.progressTracker.completeStep(id, output);
        }
      } catch (error) {
        this.progressTracker.failStep(id, error instanceof Error ? error.message : String(error));
      }
    }
  }
  
  /**
   * Obtém o rastreador de progresso
   * @returns Rastreador de progresso
   */
  getProgressTracker(): ProgressTracker {
    return this.progressTracker;
  }
  
  /**
   * Obtém o gerenciador de arquivos
   * @returns Gerenciador de arquivos
   */
  getFileManager(): FileManager {
    return this.fileManager;
  }
}
