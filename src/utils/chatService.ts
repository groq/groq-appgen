/**
 * Serviço de Chat
 * 
 * Este módulo processa mensagens do usuário e gera respostas da IA,
 * incluindo interpretação de comandos para modificar o plano.
 */

import { GroqChat } from 'groq-sdk';
import { AppPlan, PlanItem, ItemFeedback } from '../types/plan';
import { updatePlanItem, addPlanItem, removePlanItem } from './promptOptimizer';

// Configuração do cliente Groq
const setupGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY não encontrada nas variáveis de ambiente');
  }
  return new GroqChat({ apiKey });
};

// Interface para o contexto da conversa
interface ChatContext {
  plan: AppPlan;
  history: { role: 'user' | 'assistant', content: string }[];
}

/**
 * Processa uma mensagem do usuário e gera uma resposta da IA
 */
export async function processMessage(
  message: string,
  context: ChatContext
): Promise<{
  response: string;
  planUpdates?: {
    type: 'update' | 'add' | 'remove';
    sectionName: string;
    itemId?: string;
    item?: Omit<PlanItem, 'id'>;
  }[];
}> {
  const groq = setupGroqClient();
  
  // Adicionar a mensagem do usuário ao histórico
  context.history.push({ role: 'user', content: message });
  
  // Converter o plano para um formato adequado para o prompt
  const planSummary = formatPlanForPrompt(context.plan);
  
  // Sistema de instruções para o modelo
  const systemPrompt = `
    Você é um assistente especializado em planejamento de aplicações web. Sua tarefa é ajudar o usuário
    a refinar e melhorar o plano da aplicação.
    
    O plano atual da aplicação está estruturado da seguinte forma:
    ${planSummary}
    
    Ao responder ao usuário:
    1. Seja útil, amigável e profissional
    2. Quando o usuário solicitar alterações no plano, identifique claramente:
       - A seção a ser modificada (FUNCIONALIDADES, DESIGN, DADOS, INTERAÇÃO, RECURSOS ADICIONAIS)
       - O item específico a ser atualizado, adicionado ou removido
       - A alteração exata a ser feita
    3. Forneça sugestões construtivas para melhorar o plano quando apropriado
    4. Explique o raciocínio por trás das suas sugestões
    
    Além de sua resposta normal, inclua um bloco JSON no final da sua resposta quando o usuário solicitar
    alterações no plano. O bloco deve estar no formato:
    
    [PLAN_UPDATES]
    [
      {
        "type": "update", // ou "add" ou "remove"
        "sectionName": "NOME_DA_SEÇÃO",
        "itemId": "ID_DO_ITEM", // apenas para update e remove
        "item": { // apenas para update e add
          "description": "Nova descrição",
          "priority": "essencial" // ou "importante" ou "desejável"
        }
      }
    ]
    [/PLAN_UPDATES]
    
    Não inclua este bloco se não houver alterações a serem feitas no plano.
  `;

  try {
    // Enviar prompt para o modelo
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...context.history.map(msg => ({ role: msg.role, content: msg.content }))
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000
    });

    // Extrair a resposta
    const responseText = response.choices[0]?.message?.content || '';
    
    // Adicionar a resposta ao histórico
    context.history.push({ role: 'assistant', content: responseText });
    
    // Extrair atualizações do plano, se houver
    const planUpdates = extractPlanUpdates(responseText);
    
    // Remover o bloco JSON da resposta visível para o usuário
    const cleanResponse = responseText.replace(/\[PLAN_UPDATES\][\s\S]*?\[\/PLAN_UPDATES\]/g, '').trim();
    
    return {
      response: cleanResponse,
      planUpdates: planUpdates.length > 0 ? planUpdates : undefined
    };
  } catch (error) {
    console.error('Erro ao processar mensagem:', error);
    throw new Error('Falha ao gerar resposta');
  }
}

/**
 * Extrai atualizações do plano da resposta da IA
 */
function extractPlanUpdates(response: string): any[] {
  const regex = /\[PLAN_UPDATES\]([\s\S]*?)\[\/PLAN_UPDATES\]/;
  const match = response.match(regex);
  
  if (!match || !match[1]) return [];
  
  try {
    const updatesJson = match[1].trim();
    return JSON.parse(updatesJson);
  } catch (error) {
    console.error('Erro ao extrair atualizações do plano:', error);
    return [];
  }
}

/**
 * Formata o plano para inclusão no prompt
 */
function formatPlanForPrompt(plan: AppPlan): string {
  let result = `# ${plan.title}\n\n`;
  result += `${plan.description}\n\n`;
  
  // Adicionar cada seção do plano
  for (const section of plan.sections) {
    result += `## ${section.name}\n\n`;
    
    for (const item of section.items) {
      const priority = item.priority ? `[${item.priority}]` : '';
      const status = item.status ? `(${item.status})` : '';
      result += `- ID: ${item.id} ${priority} ${status} ${item.description}\n`;
      
      // Adicionar detalhes se disponíveis
      if (item.details) {
        result += `  Detalhes: ${item.details}\n`;
      }
      
      // Adicionar feedback do usuário se disponível
      if (item.userFeedback) {
        result += `  Feedback: ${item.userFeedback}\n`;
      }
    }
    
    result += '\n';
  }
  
  return result;
}

/**
 * Aplica atualizações ao plano
 */
export function applyPlanUpdates(
  plan: AppPlan,
  updates: {
    type: 'update' | 'add' | 'remove';
    sectionName: string;
    itemId?: string;
    item?: Omit<PlanItem, 'id'>;
  }[]
): AppPlan {
  let updatedPlan = { ...plan };
  
  for (const update of updates) {
    switch (update.type) {
      case 'update':
        if (update.itemId && update.item) {
          updatedPlan = updatePlanItem(
            updatedPlan,
            update.sectionName,
            update.itemId,
            update.item
          );
        }
        break;
        
      case 'add':
        if (update.item) {
          updatedPlan = addPlanItem(
            updatedPlan,
            update.sectionName,
            update.item
          );
        }
        break;
        
      case 'remove':
        if (update.itemId) {
          updatedPlan = removePlanItem(
            updatedPlan,
            update.sectionName,
            update.itemId
          );
        }
        break;
    }
  }
  
  return updatedPlan;
}
