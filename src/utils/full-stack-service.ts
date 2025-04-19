/**
 * Serviço para geração e implantação de aplicações full stack
 */

import { generateAgenticResponse } from './agentic-service';
import { parseActions, Action } from './action-parser';
import { ActionExecutor } from './action-executor';
import { initWebContainer, createFiles, startServer } from './web-container-service';
import { FileTreeItem } from '@/types/file-types';

/**
 * Gera uma aplicação full stack com base em um prompt
 * @param prompt Descrição da aplicação a ser gerada
 * @returns Arquivos e passos de progresso
 */
export async function generateFullStackApp(prompt: string) {
  // Criar o executor de ações
  const executor = new ActionExecutor();
  
  // Gerar resposta da IA com ações
  const messages = [
    { role: 'system', content: 'Você é um assistente especializado em criar aplicações full stack.' },
    { role: 'user', content: `Crie uma aplicação full stack com base na seguinte descrição: ${prompt}` }
  ];
  
  const response = await generateAgenticResponse(messages, false);
  const content = response.choices[0].message.content;
  
  // Extrair ações da resposta
  const actions = parseActions(content);
  
  // Executar ações
  await executor.executeActions(actions);
  
  // Retornar arquivos e passos de progresso
  return {
    files: executor.getFileManager().getFiles(),
    steps: executor.getProgressTracker().getSteps()
  };
}

/**
 * Implanta uma aplicação full stack no WebContainer
 * @param files Arquivos da aplicação
 * @returns URL da aplicação implantada
 */
export async function deployFullStackApp(files: Map<string, string>) {
  // Converter arquivos para o formato do WebContainer
  const fileTreeItems: FileTreeItem[] = [];
  
  files.forEach((content, path) => {
    const parts = path.split('/');
    const name = parts[parts.length - 1];
    const language = name.endsWith('.js') ? 'javascript' : 
                    name.endsWith('.ts') ? 'typescript' : 
                    name.endsWith('.html') ? 'html' : 
                    name.endsWith('.css') ? 'css' : 'plaintext';
    
    fileTreeItems.push({
      name,
      type: 'file',
      path,
      content,
      language
    });
  });
  
  // Inicializar WebContainer
  await initWebContainer();
  
  // Criar arquivos no WebContainer
  await createFiles(fileTreeItems);
  
  // Iniciar servidor
  const url = await startServer('npm start');
  
  return { url };
}

/**
 * Gera e implanta uma aplicação full stack com base em um prompt
 * @param prompt Descrição da aplicação a ser gerada
 * @returns URL da aplicação implantada e passos de progresso
 */
export async function generateAndDeployFullStackApp(prompt: string) {
  // Gerar aplicação
  const { files, steps } = await generateFullStackApp(prompt);
  
  // Implantar aplicação
  const { url } = await deployFullStackApp(files);
  
  return { url, steps };
}
