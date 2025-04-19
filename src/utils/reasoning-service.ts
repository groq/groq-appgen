/**
 * Serviço de Raciocínio
 * 
 * Este módulo fornece funções para geração de raciocínio detalhado usando a API da Groq.
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
 * Gera uma resposta com raciocínio detalhado
 * @param messages Lista de mensagens
 * @param stream Se deve usar streaming
 * @returns Resposta do modelo
 */
export async function generateReasoningResponse(
  messages: Message[],
  stream: boolean = false
): Promise<any> {
  try {
    // Adicionar prompt de sistema para raciocínio
    const messagesWithSystem = [
      {
        role: 'system',
        content: `Você é um assistente especializado em desenvolvimento de software, capaz de criar aplicações completas com front-end e back-end.
        
        Ao responder, use o seguinte formato para mostrar seu raciocínio:
        
        <reasoning>
        Aqui você deve mostrar seu raciocínio passo a passo, considerando diferentes abordagens e avaliando prós e contras.
        </reasoning>
        
        <answer>
        Aqui você deve fornecer sua resposta final, baseada no raciocínio acima.
        </answer>
        
        <action type="file" filePath="caminho/do/arquivo">
        Conteúdo completo do arquivo
        </action>
        
        <action type="shell">
        comando a ser executado
        </action>
        
        Use este formato para todas as suas respostas, garantindo que seu raciocínio seja claro e detalhado.`
      },
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
      
      return response;
    } else {
      // Gerar resposta sem streaming
      const response = await groq.chat.completions.create({
        messages: messagesWithSystem,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens: 4000,
      });
      
      return response;
    }
  } catch (error) {
    console.error('Erro ao gerar resposta com raciocínio:', error);
    throw error;
  }
}
