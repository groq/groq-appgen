/**
 * Serviço para processamento de feedback visual (anotações e seleções de elementos)
 */

import { generateAgenticResponse } from './agentic-service';
import { analyzeImage } from './vision-service';
import { parseActions } from './action-parser';
import { FileTreeItem } from '@/types/file-types';

/**
 * Interface para o resultado do processamento de anotações visuais
 */
export interface VisualFeedbackResult {
  interpretation: string;
  suggestedChanges: string[];
  actions?: any[];
  files?: FileTreeItem[];
}

/**
 * Processa uma imagem anotada e retorna interpretações e ações sugeridas
 * @param imageUrl URL da imagem anotada (base64)
 * @param notes Notas adicionais do usuário
 * @returns Resultado do processamento
 */
export async function processAnnotatedImage(imageUrl: string, notes: string): Promise<VisualFeedbackResult> {
  try {
    // Primeiro, usar a API de visão para analisar a imagem
    const visionPrompt = `
      Analise esta imagem que contém anotações feitas pelo usuário em uma interface.
      Identifique o que o usuário está tentando comunicar através das anotações.
      Considere elementos como setas, círculos, retângulos, texto escrito à mão, etc.

      Notas adicionais do usuário: ${notes || 'Nenhuma nota fornecida'}

      Forneça uma interpretação detalhada das anotações e sugira mudanças específicas
      que devem ser feitas na interface com base nessas anotações.

      Estruture sua resposta da seguinte forma:

      # Interpretação
      [Sua interpretação detalhada das anotações]

      # Sugestões de Mudanças
      1. [Primeira sugestão]
      2. [Segunda sugestão]
      3. [E assim por diante...]

      # Elementos Afetados
      - [Elemento 1]: [Descrição da mudança]
      - [Elemento 2]: [Descrição da mudança]
    `;

    const visionResponse = await analyzeImage(imageUrl, visionPrompt, false);
    const visionContent = visionResponse.choices[0].message.content;

    // Agora, usar o modelo agentic para gerar ações baseadas na interpretação
    const messages = [
      { role: 'system', content: 'Você é um assistente especializado em converter feedback visual em ações concretas de código.' },
      { role: 'user', content: `
        Com base na seguinte análise de uma imagem anotada, gere ações específicas de código que implementem as mudanças sugeridas.

        Análise da imagem:
        ${visionContent}

        Gere ações no formato:
        <action type="file" filePath="caminho/do/arquivo">
        // Código a ser adicionado ou modificado
        </action>

        Você pode gerar múltiplas ações. Seja específico sobre quais arquivos devem ser modificados e como.
      `}
    ];

    const agenticResponse = await generateAgenticResponse(messages, false);
    const agenticContent = agenticResponse.choices[0].message.content;

    // Extrair ações do conteúdo
    const actions = parseActions(agenticContent);

    // Converter ações em arquivos
    const files: FileTreeItem[] = actions
      .filter(action => action.type === 'file')
      .map(action => ({
        name: action.filePath.split('/').pop() || '',
        type: 'file',
        path: action.filePath,
        content: action.content,
        language: getLanguageFromFilePath(action.filePath)
      }));

    // Extrair sugestões de mudanças do conteúdo da visão
    const suggestedChanges = extractSuggestedChanges(visionContent);

    return {
      interpretation: visionContent,
      suggestedChanges,
      actions,
      files
    };
  } catch (error) {
    console.error('Erro ao processar imagem anotada:', error);
    return {
      interpretation: 'Erro ao processar a imagem anotada.',
      suggestedChanges: ['Tente novamente com anotações mais claras.']
    };
  }
}

/**
 * Processa feedback sobre um elemento específico
 * @param elementPath Caminho do elemento selecionado
 * @param feedback Feedback do usuário
 * @returns Resultado do processamento
 */
export async function processElementFeedback(elementPath: string, feedback: string): Promise<VisualFeedbackResult> {
  try {
    const messages = [
      { role: 'system', content: 'Você é um assistente especializado em converter feedback sobre elementos específicos em ações concretas de código.' },
      { role: 'user', content: `
        O usuário selecionou o seguinte elemento na interface:
        ${elementPath}

        E forneceu o seguinte feedback:
        ${feedback}

        Gere ações específicas de código que implementem as mudanças solicitadas.

        Gere ações no formato:
        <action type="file" filePath="caminho/do/arquivo">
        // Código a ser adicionado ou modificado
        </action>

        Você pode gerar múltiplas ações. Seja específico sobre quais arquivos devem ser modificados e como.
      `}
    ];

    const agenticResponse = await generateAgenticResponse(messages, false);
    const agenticContent = agenticResponse.choices[0].message.content;

    // Extrair ações do conteúdo
    const actions = parseActions(agenticContent);

    // Converter ações em arquivos
    const files: FileTreeItem[] = actions
      .filter(action => action.type === 'file')
      .map(action => ({
        name: action.filePath.split('/').pop() || '',
        type: 'file',
        path: action.filePath,
        content: action.content,
        language: getLanguageFromFilePath(action.filePath)
      }));

    // Extrair interpretação e sugestões
    const interpretation = `Feedback sobre o elemento: ${elementPath}\n\n${feedback}`;
    const suggestedChanges = actions.map(action =>
      action.type === 'file'
        ? `Modificar arquivo: ${action.filePath}`
        : `Executar comando: ${action.content}`
    );

    return {
      interpretation,
      suggestedChanges,
      actions,
      files
    };
  } catch (error) {
    console.error('Erro ao processar feedback de elemento:', error);
    return {
      interpretation: 'Erro ao processar o feedback sobre o elemento.',
      suggestedChanges: ['Tente novamente com um feedback mais claro.']
    };
  }
}

/**
 * Extrai sugestões de mudanças de um texto
 * @param text Texto a ser analisado
 * @returns Lista de sugestões
 */
function extractSuggestedChanges(text: string): string[] {
  // Tentar encontrar uma lista de sugestões no texto
  const suggestionsMatch = text.match(/sugest(ão|ões|es)[\s\S]*?:[\s\S]*?((?:\d+\.\s.*\n)+)/i) ||
                          text.match(/mudança[s]?[\s\S]*?:[\s\S]*?((?:\d+\.\s.*\n)+)/i) ||
                          text.match(/recomenda[ções|ção][\s\S]*?:[\s\S]*?((?:\d+\.\s.*\n)+)/i);

  if (suggestionsMatch && suggestionsMatch[2]) {
    return suggestionsMatch[2]
      .split('\n')
      .filter(line => line.trim().match(/^\d+\.\s/))
      .map(line => line.replace(/^\d+\.\s/, '').trim())
      .filter(line => line.length > 0);
  }

  // Se não encontrar uma lista formatada, tentar extrair frases que parecem sugestões
  const sentences = text.split(/[.!?]\s+/);
  return sentences
    .filter(sentence =>
      sentence.match(/deve[ria]?|poder[ia]?|seria|recomend[o|a-se]|suger[e|imos|o]|mudar|alterar|adicionar|remover|ajustar/i)
    )
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 10);
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
