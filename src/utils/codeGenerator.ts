/**
 * Gerador de Código
 * 
 * Este módulo transforma um plano aprovado em código HTML, CSS e JavaScript
 * para criar a aplicação web.
 */

import { GroqChat } from 'groq-sdk';
import { AppPlan } from '../types/plan';

// Configuração do cliente Groq
const setupGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY não encontrada nas variáveis de ambiente');
  }
  return new GroqChat({ apiKey });
};

/**
 * Gera código HTML, CSS e JavaScript a partir de um plano aprovado
 */
export async function generateCode(plan: AppPlan): Promise<string> {
  const groq = setupGroqClient();
  
  // Converter o plano para um formato adequado para o prompt
  const planSummary = formatPlanForPrompt(plan);
  
  // Sistema de instruções para o modelo
  const systemPrompt = `
    Você é um especialista em desenvolvimento web full-stack. Sua tarefa é transformar
    um plano estruturado em código HTML, CSS e JavaScript funcional.
    
    Siga estas diretrizes:
    
    1. Crie uma única página HTML que inclua todo o CSS e JavaScript necessários
    2. Use bibliotecas externas apenas quando especificado no plano (via CDN)
    3. Implemente todas as funcionalidades marcadas como "essencial" ou "importante"
    4. Siga as especificações de design (cores, layout, etc.) exatamente como descritas
    5. Garanta que a aplicação seja responsiva e funcione em dispositivos móveis
    6. Adicione comentários explicativos no código
    7. Implemente validação de entrada e tratamento de erros
    8. Use armazenamento local (localStorage) quando necessário para persistência
    
    Retorne APENAS o código HTML completo, sem explicações adicionais.
    O código deve ser válido, bem formatado e pronto para uso.
  `;

  try {
    // Enviar prompt para o modelo
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Crie uma aplicação web com base no seguinte plano:\n\n${planSummary}` }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 4000
    });

    // Extrair o código HTML
    const code = response.choices[0]?.message?.content || '';
    return code;
  } catch (error) {
    console.error('Erro ao gerar código:', error);
    throw new Error('Falha ao gerar código da aplicação');
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
    
    // Adicionar itens aprovados ou sem status definido
    const items = section.items.filter(item => 
      item.status === 'aprovado' || !item.status || item.status === 'pendente'
    );
    
    for (const item of items) {
      const priority = item.priority ? `[${item.priority}]` : '';
      result += `- ${priority} ${item.description}\n`;
      
      // Adicionar detalhes se disponíveis
      if (item.details) {
        result += `  Detalhes: ${item.details}\n`;
      }
    }
    
    result += '\n';
  }
  
  return result;
}

/**
 * Simula o progresso da geração de código
 * Usado para fornecer feedback visual ao usuário durante a geração
 */
export function simulateCodeGeneration(
  onProgress: (progress: number) => void,
  onComplete: (html: string) => void,
  plan: AppPlan
): { cancel: () => void } {
  let isCancelled = false;
  let progress = 0;
  
  // Estimar tempo total baseado na complexidade do plano
  const totalItems = plan.sections.reduce((sum, section) => 
    sum + section.items.filter(i => i.status === 'aprovado' || !i.status).length, 0);
  
  const totalTime = Math.max(3000, Math.min(10000, totalItems * 500));
  const interval = 100;
  const steps = totalTime / interval;
  
  // Iniciar geração real em paralelo
  const generateRealCode = async () => {
    try {
      const html = await generateCode(plan);
      if (!isCancelled) {
        // Garantir que o progresso chegue a 100% antes de completar
        progress = 100;
        onProgress(progress);
        
        // Pequeno atraso para mostrar 100% antes de completar
        setTimeout(() => {
          if (!isCancelled) {
            onComplete(html);
          }
        }, 500);
      }
    } catch (error) {
      console.error('Erro na geração de código:', error);
      if (!isCancelled) {
        throw error;
      }
    }
  };
  
  generateRealCode();
  
  // Simular progresso enquanto o código real é gerado
  const timer = setInterval(() => {
    if (isCancelled) {
      clearInterval(timer);
      return;
    }
    
    // Incrementar progresso de forma não linear para parecer mais natural
    if (progress < 90) {
      const increment = (90 - progress) / steps;
      progress += increment;
      onProgress(progress);
    }
  }, interval);
  
  return {
    cancel: () => {
      isCancelled = true;
      clearInterval(timer);
    }
  };
}
