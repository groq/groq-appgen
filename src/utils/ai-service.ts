/**
 * Serviço de IA
 * 
 * Este módulo fornece funções para comunicação com a API da Groq.
 */

import { Groq } from 'groq-sdk';
import { SYSTEM_PROMPT, SEARCH_PROMPT, PLANNING_PROMPT } from './system-prompt';

// Configurar cliente Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Gera uma resposta da IA
 * @param messages Lista de mensagens
 * @param stream Se deve usar streaming
 * @returns Resposta da IA
 */
export async function generateResponse(
  messages: Message[],
  stream: boolean = false
): Promise<string | ReadableStream> {
  try {
    // Adicionar prompt de sistema
    const messagesWithSystem = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];
    
    if (stream) {
      // Gerar resposta com streaming
      const response = await groq.chat.completions.create({
        messages: messagesWithSystem,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens: 4000,
        stream: true,
      });
      
      // Criar stream de resposta
      const encoder = new TextEncoder();
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();
      
      // Processar chunks de resposta
      (async () => {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              await writer.write(encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`));
            }
          }
          await writer.close();
        } catch (error) {
          console.error('Erro no streaming:', error);
          await writer.abort(error);
        }
      })();
      
      return stream.readable;
    } else {
      // Gerar resposta sem streaming
      const response = await groq.chat.completions.create({
        messages: messagesWithSystem,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens: 4000,
      });
      
      return response.choices[0]?.message?.content || '';
    }
  } catch (error) {
    console.error('Erro ao gerar resposta:', error);
    throw error;
  }
}

/**
 * Gera uma resposta com base em informações de pesquisa
 * @param query Consulta do usuário
 * @param searchResults Resultados da pesquisa
 * @returns Resposta da IA
 */
export async function generateResponseWithSearch(
  query: string,
  searchResults: string
): Promise<string> {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SEARCH_PROMPT },
        { role: 'user', content: `Consulta: ${query}\n\nResultados da pesquisa:\n${searchResults}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 2000,
    });
    
    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Erro ao gerar resposta com pesquisa:', error);
    throw error;
  }
}

/**
 * Gera um plano de projeto
 * @param objectives Objetivos do projeto
 * @param requirements Requisitos do projeto
 * @param technologies Tecnologias do projeto
 * @returns Plano de projeto
 */
export async function generateProjectPlan(
  objectives: any,
  requirements: any[],
  technologies: any
): Promise<string> {
  try {
    const prompt = `
    Objetivos do Projeto:
    Título: ${objectives.title || 'Não especificado'}
    Descrição: ${objectives.description || 'Não especificado'}
    Público-Alvo: ${objectives.targetAudience || 'Não especificado'}
    
    Requisitos:
    ${requirements.map(req => `- [${req.priority}] ${req.description}`).join('\n')}
    
    Tecnologias:
    Frontend: ${technologies.frontend?.join(', ') || 'Não especificado'}
    Backend: ${technologies.backend?.join(', ') || 'Não especificado'}
    Banco de Dados: ${technologies.database?.join(', ') || 'Não especificado'}
    Deployment: ${technologies.deployment?.join(', ') || 'Não especificado'}
    `;
    
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: PLANNING_PROMPT },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 2000,
    });
    
    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Erro ao gerar plano de projeto:', error);
    throw error;
  }
}
