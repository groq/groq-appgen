/**
 * Serviço de Execução de Código
 * 
 * Este módulo fornece funções para execução de código usando o Agentic Tooling da Groq.
 */

import { Groq } from 'groq-sdk';

// Configurar cliente Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Executa código usando o Agentic Tooling
 * @param code Código a ser executado
 * @param language Linguagem do código
 * @returns Resultado da execução
 */
export async function executeCode(
  code: string,
  language: string = 'python'
): Promise<string> {
  try {
    // Criar mensagem para o modelo
    const messages: Message[] = [
      {
        role: 'system',
        content: `Você é um assistente especializado em execução de código. Execute o código fornecido e retorne o resultado.`
      },
      {
        role: 'user',
        content: `Execute o seguinte código ${language}:\n\n\`\`\`${language}\n${code}\n\`\`\``
      }
    ];

    // Chamar a API do Agentic Tooling
    const response = await groq.chat.completions.create({
      messages,
      model: 'compound-beta',
      temperature: 0.2,
      max_tokens: 4000,
    });

    // Extrair resultado
    const result = response.choices[0].message.content || '';
    
    return result;
  } catch (error) {
    console.error('Erro ao executar código:', error);
    throw error;
  }
}

/**
 * Gera e executa código com base em uma descrição
 * @param description Descrição do código a ser gerado e executado
 * @param language Linguagem do código
 * @returns Código gerado e resultado da execução
 */
export async function generateAndExecuteCode(
  description: string,
  language: string = 'python'
): Promise<{ code: string; result: string }> {
  try {
    // Criar mensagem para o modelo
    const messages: Message[] = [
      {
        role: 'system',
        content: `Você é um assistente especializado em geração e execução de código. Gere código com base na descrição fornecida, execute-o e retorne o resultado.`
      },
      {
        role: 'user',
        content: `Gere e execute código ${language} que faça o seguinte: ${description}`
      }
    ];

    // Chamar a API do Agentic Tooling
    const response = await groq.chat.completions.create({
      messages,
      model: 'compound-beta',
      temperature: 0.5,
      max_tokens: 4000,
    });

    // Extrair código e resultado
    const content = response.choices[0].message.content || '';
    
    // Extrair código do conteúdo
    const codeRegex = new RegExp(`\`\`\`${language}([\\s\\S]*?)\`\`\``, 'i');
    const codeMatch = content.match(codeRegex);
    const code = codeMatch ? codeMatch[1].trim() : '';
    
    // Extrair resultado (tudo após o último bloco de código)
    const resultMatch = content.split(/\`\`\`.*?\`\`\`/g).pop() || '';
    const result = resultMatch.trim();
    
    return { code, result };
  } catch (error) {
    console.error('Erro ao gerar e executar código:', error);
    throw error;
  }
}
