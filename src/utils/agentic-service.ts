/**
 * Serviço de Agentic Tooling
 * 
 * Este módulo fornece funções para comunicação com a API da Groq usando o modelo compound-beta,
 * que possui ferramentas integradas para pesquisa na web e execução de código.
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
 * Gera uma resposta usando o modelo compound-beta
 * @param messages Lista de mensagens
 * @param stream Se deve usar streaming
 * @returns Resposta do modelo
 */
export async function generateAgenticResponse(
  messages: Message[],
  stream: boolean = false
): Promise<any> {
  try {
    if (stream) {
      // Gerar resposta com streaming
      const response = await groq.chat.completions.create({
        messages,
        model: 'compound-beta',
        temperature: 0.5,
        max_tokens: 4000,
        stream: true,
      });
      
      return response;
    } else {
      // Gerar resposta sem streaming
      const response = await groq.chat.completions.create({
        messages,
        model: 'compound-beta',
        temperature: 0.5,
        max_tokens: 4000,
      });
      
      return response;
    }
  } catch (error) {
    console.error('Erro ao gerar resposta com Agentic Tooling:', error);
    throw error;
  }
}

/**
 * Gera uma resposta usando o modelo compound-beta-mini
 * @param messages Lista de mensagens
 * @param stream Se deve usar streaming
 * @returns Resposta do modelo
 */
export async function generateAgenticMiniResponse(
  messages: Message[],
  stream: boolean = false
): Promise<any> {
  try {
    if (stream) {
      // Gerar resposta com streaming
      const response = await groq.chat.completions.create({
        messages,
        model: 'compound-beta-mini',
        temperature: 0.5,
        max_tokens: 4000,
        stream: true,
      });
      
      return response;
    } else {
      // Gerar resposta sem streaming
      const response = await groq.chat.completions.create({
        messages,
        model: 'compound-beta-mini',
        temperature: 0.5,
        max_tokens: 4000,
      });
      
      return response;
    }
  } catch (error) {
    console.error('Erro ao gerar resposta com Agentic Tooling Mini:', error);
    throw error;
  }
}
