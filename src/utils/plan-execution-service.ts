/**
 * Serviço para execução de planos e geração de código
 */

import { PlanData } from '@/components/PlanningModule';
import { generateAgenticResponse } from './agentic-service';
import { parseActions } from './action-parser';
import { FileTreeItem } from '@/types/file-types';

/**
 * Interface para o resultado da execução de um plano
 */
export interface PlanExecutionResult {
  files: FileTreeItem[];
  steps: {
    id: string;
    title: string;
    status: 'pending' | 'running' | 'complete' | 'failed';
    description?: string;
    error?: string;
  }[];
  commands: string[];
}

/**
 * Gera código a partir de um plano
 * @param plan Dados do plano
 * @returns Resultado da execução do plano
 */
export async function generateCodeFromPlan(plan: PlanData): Promise<PlanExecutionResult> {
  // Inicializar o resultado
  const result: PlanExecutionResult = {
    files: [],
    steps: [],
    commands: []
  };
  
  try {
    // Converter o plano em um formato mais legível para a IA
    const planDescription = formatPlanForAI(plan);
    
    // Criar os passos de progresso com base no plano de implementação
    result.steps = plan.implementation.map(step => ({
      id: step.id,
      title: step.step,
      status: 'pending',
      description: step.description
    }));
    
    // Atualizar o primeiro passo para 'running'
    if (result.steps.length > 0) {
      result.steps[0].status = 'running';
    }
    
    // Gerar código para cada passo do plano
    for (let i = 0; i < plan.implementation.length; i++) {
      const step = plan.implementation[i];
      
      // Atualizar o status do passo atual
      result.steps[i].status = 'running';
      
      // Gerar código para o passo atual
      const stepResult = await generateCodeForStep(planDescription, step, i + 1, plan.implementation.length);
      
      // Adicionar arquivos e comandos ao resultado
      result.files = [...result.files, ...stepResult.files];
      result.commands = [...result.commands, ...stepResult.commands];
      
      // Atualizar o status do passo atual
      result.steps[i].status = 'complete';
      
      // Atualizar o próximo passo para 'running' (se houver)
      if (i + 1 < result.steps.length) {
        result.steps[i + 1].status = 'running';
      }
    }
    
    return result;
  } catch (error) {
    console.error('Erro ao gerar código a partir do plano:', error);
    
    // Marcar o passo atual como falho
    const runningStepIndex = result.steps.findIndex(step => step.status === 'running');
    if (runningStepIndex >= 0) {
      result.steps[runningStepIndex].status = 'failed';
      result.steps[runningStepIndex].error = error instanceof Error ? error.message : String(error);
    }
    
    return result;
  }
}

/**
 * Interface para o resultado da geração de código para um passo
 */
interface StepGenerationResult {
  files: FileTreeItem[];
  commands: string[];
}

/**
 * Gera código para um passo específico do plano
 * @param planDescription Descrição do plano
 * @param step Passo atual
 * @param stepNumber Número do passo
 * @param totalSteps Número total de passos
 * @returns Resultado da geração de código para o passo
 */
async function generateCodeForStep(
  planDescription: string,
  step: { id: string; step: string; description: string; estimatedTime: string },
  stepNumber: number,
  totalSteps: number
): Promise<StepGenerationResult> {
  const messages = [
    { role: 'system', content: 'Você é um assistente especializado em gerar código a partir de planos de implementação.' },
    { role: 'user', content: `
      Estou implementando um projeto com base no seguinte plano:
      
      ${planDescription}
      
      Agora estou no passo ${stepNumber} de ${totalSteps}:
      
      Passo: ${step.step}
      Descrição: ${step.description}
      
      Por favor, gere o código necessário para implementar este passo específico.
      Considere os arquivos que já foram criados em passos anteriores.
      
      Gere ações no formato:
      <action type="file" filePath="caminho/do/arquivo">
      // Código a ser adicionado ou modificado
      </action>
      
      Você também pode gerar comandos shell no formato:
      <action type="shell">
      comando a ser executado
      </action>
      
      Seja específico e detalhado. Gere código completo e funcional.
    `}
  ];
  
  const response = await generateAgenticResponse(messages, false);
  const content = response.choices[0].message.content;
  
  // Extrair ações do conteúdo
  const actions = parseActions(content);
  
  // Converter ações em arquivos e comandos
  const files: FileTreeItem[] = [];
  const commands: string[] = [];
  
  for (const action of actions) {
    if (action.type === 'file') {
      files.push({
        name: action.filePath.split('/').pop() || '',
        type: 'file',
        path: action.filePath,
        content: action.content,
        language: getLanguageFromFilePath(action.filePath)
      });
    } else if (action.type === 'shell') {
      commands.push(action.content);
    }
  }
  
  return { files, commands };
}

/**
 * Formata o plano para ser enviado à IA
 * @param plan Dados do plano
 * @returns Descrição formatada do plano
 */
function formatPlanForAI(plan: PlanData): string {
  let result = '';
  
  // Objetivos
  result += '## Objetivos\n';
  result += `Título: ${plan.objectives.title || 'Não especificado'}\n`;
  result += `Descrição: ${plan.objectives.description || 'Não especificado'}\n`;
  result += `Público-alvo: ${plan.objectives.targetAudience || 'Não especificado'}\n\n`;
  
  // Requisitos
  result += '## Requisitos\n';
  if (plan.requirements.length > 0) {
    plan.requirements.forEach((req, index) => {
      result += `${index + 1}. ${req.description} (${req.priority})\n`;
    });
  } else {
    result += 'Nenhum requisito especificado.\n';
  }
  result += '\n';
  
  // Tecnologias
  result += '## Tecnologias\n';
  if (plan.technologies.frontend && plan.technologies.frontend.length > 0) {
    result += `Frontend: ${plan.technologies.frontend.join(', ')}\n`;
  }
  if (plan.technologies.backend && plan.technologies.backend.length > 0) {
    result += `Backend: ${plan.technologies.backend.join(', ')}\n`;
  }
  if (plan.technologies.database && plan.technologies.database.length > 0) {
    result += `Database: ${plan.technologies.database.join(', ')}\n`;
  }
  if (plan.technologies.deployment && plan.technologies.deployment.length > 0) {
    result += `Deployment: ${plan.technologies.deployment.join(', ')}\n`;
  }
  result += '\n';
  
  // Arquitetura
  result += '## Arquitetura\n';
  if (plan.architecture.components && plan.architecture.components.length > 0) {
    result += `Componentes: ${plan.architecture.components.join(', ')}\n`;
  }
  if (plan.architecture.dataFlow) {
    result += `Fluxo de dados: ${plan.architecture.dataFlow}\n`;
  }
  result += '\n';
  
  // Plano de implementação
  result += '## Plano de Implementação\n';
  if (plan.implementation.length > 0) {
    plan.implementation.forEach((imp, index) => {
      result += `${index + 1}. ${imp.step}: ${imp.description} (${imp.estimatedTime})\n`;
    });
  } else {
    result += 'Nenhum passo de implementação especificado.\n';
  }
  
  return result;
}

/**
 * Determina a linguagem de um arquivo com base em sua extensão
 * @param filePath Caminho do arquivo
 * @returns Linguagem do arquivo
 */
function getLanguageFromFilePath(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'json': 'json',
    'md': 'markdown',
    'py': 'python',
    'rb': 'ruby',
    'java': 'java',
    'php': 'php',
    'go': 'go',
    'rs': 'rust',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp'
  };
  
  return languageMap[extension] || 'plaintext';
}
