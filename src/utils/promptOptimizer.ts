/**
 * Prompt Optimizer
 * 
 * Este módulo transforma prompts simples do usuário em planos estruturados
 * para geração de aplicações de alta qualidade.
 */

import { GroqChat } from 'groq-sdk';
import { AppPlan, PlanSection, PlanItem } from '../types/plan';

// Configuração do cliente Groq
const setupGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY não encontrada nas variáveis de ambiente');
  }
  return new GroqChat({ apiKey });
};

/**
 * Transforma um prompt simples em um plano estruturado
 */
export async function optimizePrompt(userPrompt: string): Promise<AppPlan> {
  const groq = setupGroqClient();
  
  // Sistema de instruções para o modelo
  const systemPrompt = `
    Você é um especialista em planejamento de aplicações web. Sua tarefa é transformar
    prompts simples em planos estruturados e detalhados.
    
    Analise o prompt do usuário e crie um plano estruturado com as seguintes seções:
    
    1. FUNCIONALIDADES (essenciais): Recursos principais que a aplicação deve ter
    2. DESIGN: Especificações visuais, incluindo cores (com códigos hexadecimais), layout e estilo
    3. DADOS: Estrutura de dados, armazenamento e exemplos
    4. INTERAÇÃO: Como o usuário interage com a aplicação, feedback e comportamentos
    5. RECURSOS ADICIONAIS (opcionais): Funcionalidades extras que melhorariam a aplicação
    
    Para cada seção, forneça itens específicos e detalhados.
    Seja específico com cores, dimensões, comportamentos e estruturas de dados.
    Priorize os itens em cada seção.
    
    Retorne o plano em formato JSON estruturado conforme o exemplo:
    
    {
      "title": "Título da Aplicação",
      "description": "Breve descrição da aplicação",
      "sections": [
        {
          "name": "FUNCIONALIDADES",
          "items": [
            { "id": "func-1", "description": "Descrição da funcionalidade 1", "priority": "essencial" },
            { "id": "func-2", "description": "Descrição da funcionalidade 2", "priority": "importante" }
          ]
        },
        {
          "name": "DESIGN",
          "items": [...]
        },
        ...
      ]
    }
  `;

  try {
    // Enviar prompt para o modelo
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Crie um plano estruturado para: "${userPrompt}"` }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    // Extrair e validar o plano JSON
    const planText = response.choices[0]?.message?.content || '';
    const plan = JSON.parse(planText) as AppPlan;
    
    // Garantir que o plano tenha a estrutura esperada
    validatePlan(plan);
    
    return plan;
  } catch (error) {
    console.error('Erro ao otimizar prompt:', error);
    throw new Error('Falha ao gerar plano estruturado');
  }
}

/**
 * Valida a estrutura do plano
 */
function validatePlan(plan: AppPlan): void {
  if (!plan.title || !plan.description || !Array.isArray(plan.sections)) {
    throw new Error('Plano inválido: estrutura básica incompleta');
  }
  
  // Verificar se todas as seções necessárias estão presentes
  const requiredSections = ['FUNCIONALIDADES', 'DESIGN', 'DADOS', 'INTERAÇÃO'];
  const sectionNames = plan.sections.map(s => s.name);
  
  for (const required of requiredSections) {
    if (!sectionNames.includes(required)) {
      throw new Error(`Plano inválido: seção ${required} ausente`);
    }
  }
  
  // Verificar se cada seção tem pelo menos um item
  for (const section of plan.sections) {
    if (!Array.isArray(section.items) || section.items.length === 0) {
      throw new Error(`Plano inválido: seção ${section.name} não tem itens`);
    }
  }
}

/**
 * Atualiza um item específico no plano
 */
export function updatePlanItem(
  plan: AppPlan, 
  sectionName: string, 
  itemId: string, 
  updates: Partial<PlanItem>
): AppPlan {
  const updatedPlan = { ...plan };
  
  const sectionIndex = updatedPlan.sections.findIndex(s => s.name === sectionName);
  if (sectionIndex === -1) return plan;
  
  const section = updatedPlan.sections[sectionIndex];
  const itemIndex = section.items.findIndex(item => item.id === itemId);
  if (itemIndex === -1) return plan;
  
  // Atualizar o item
  section.items[itemIndex] = { ...section.items[itemIndex], ...updates };
  
  return updatedPlan;
}

/**
 * Adiciona um novo item a uma seção do plano
 */
export function addPlanItem(
  plan: AppPlan,
  sectionName: string,
  newItem: Omit<PlanItem, 'id'>
): AppPlan {
  const updatedPlan = { ...plan };
  
  const sectionIndex = updatedPlan.sections.findIndex(s => s.name === sectionName);
  if (sectionIndex === -1) return plan;
  
  // Gerar ID único para o novo item
  const id = `${sectionName.toLowerCase()}-${Date.now()}`;
  
  // Adicionar o item à seção
  updatedPlan.sections[sectionIndex].items.push({
    id,
    ...newItem
  });
  
  return updatedPlan;
}

/**
 * Remove um item do plano
 */
export function removePlanItem(
  plan: AppPlan,
  sectionName: string,
  itemId: string
): AppPlan {
  const updatedPlan = { ...plan };
  
  const sectionIndex = updatedPlan.sections.findIndex(s => s.name === sectionName);
  if (sectionIndex === -1) return plan;
  
  // Filtrar o item a ser removido
  updatedPlan.sections[sectionIndex].items = 
    updatedPlan.sections[sectionIndex].items.filter(item => item.id !== itemId);
  
  return updatedPlan;
}
