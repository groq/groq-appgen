/**
 * Serviço de Visão Computacional
 * 
 * Este módulo fornece funções para análise de imagens usando a API da Groq.
 */

import { Groq } from 'groq-sdk';

// Configurar cliente Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: any;
}

/**
 * Analisa uma imagem
 * @param imageUrl URL da imagem
 * @param prompt Prompt para a análise
 * @param stream Se deve usar streaming
 * @returns Resposta do modelo
 */
export async function analyzeImage(
  imageUrl: string,
  prompt: string,
  stream: boolean = false
): Promise<any> {
  try {
    const messages: Message[] = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ];

    if (stream) {
      // Gerar resposta com streaming
      const response = await groq.chat.completions.create({
        messages,
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        temperature: 0.5,
        max_tokens: 4000,
        stream: true,
      });
      
      return response;
    } else {
      // Gerar resposta sem streaming
      const response = await groq.chat.completions.create({
        messages,
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        temperature: 0.5,
        max_tokens: 4000,
      });
      
      return response;
    }
  } catch (error) {
    console.error('Erro ao analisar imagem:', error);
    throw error;
  }
}

/**
 * Analisa uma imagem com ferramentas
 * @param imageUrl URL da imagem
 * @param prompt Prompt para a análise
 * @param tools Ferramentas a serem usadas
 * @returns Resposta do modelo
 */
export async function analyzeImageWithTools(
  imageUrl: string,
  prompt: string,
  tools: any[]
): Promise<any> {
  try {
    const messages: Message[] = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ];

    // Gerar resposta com ferramentas
    const response = await groq.chat.completions.create({
      messages,
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 0.5,
      max_tokens: 4000,
      tools,
      tool_choice: 'auto',
    });
    
    return response;
  } catch (error) {
    console.error('Erro ao analisar imagem com ferramentas:', error);
    throw error;
  }
}
