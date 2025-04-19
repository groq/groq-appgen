/**
 * UX Agent - Agente de análise de UX que utiliza a API da Groq
 *
 * Este módulo fornece funções para analisar screenshots e feedback do usuário
 * e gerar recomendações de melhorias de UX.
 */

import { Groq } from "groq-sdk";

// Tipos para análise de UX
export interface UXAnalysisResult {
  issues: UXIssue[];
  recommendations: string[];
  codeChanges?: CodeChange[];
}

export interface UXIssue {
  type: UXIssueType;
  severity: 'low' | 'medium' | 'high';
  description: string;
  location: string;
  impact?: string;
}

export interface CodeChange {
  file: string;
  description: string;
  code: string;
}

export type UXIssueType =
  | 'overflow' // Elementos fora da tela ou cortados
  | 'alignment' // Problemas de alinhamento
  | 'proportion' // Elementos desproporcionais
  | 'contrast' // Problemas de contraste
  | 'consistency' // Inconsistências de design
  | 'spacing' // Problemas de espaçamento
  | 'readability' // Problemas de legibilidade
  | 'accessibility' // Problemas de acessibilidade
  | 'responsiveness' // Problemas de responsividade
  | 'usability' // Problemas de usabilidade
  | 'performance' // Problemas de performance visual
  | 'other'; // Outros problemas

/**
 * Analisa uma screenshot e feedback do usuário
 * @param imageBase64 Screenshot em formato base64
 * @param feedback Feedback do usuário (opcional)
 * @param elementInfo Informações sobre o elemento selecionado (opcional)
 * @returns Resultado da análise de UX
 */
export async function analyzeUX(
  imageBase64: string,
  feedback?: string,
  elementInfo?: string
): Promise<UXAnalysisResult> {
  try {
    // Usar a API route em vez de chamar a API da Groq diretamente
    const response = await fetch('/api/analyze-ux', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        feedback,
        elementInfo
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao chamar a API');
    }

    const analysisResult = await response.json() as UXAnalysisResult;
    return analysisResult;
  } catch (error) {
    console.error("Erro ao analisar UX:", error);
    return {
      issues: [
        {
          type: 'other',
          severity: 'high',
          description: `Erro ao chamar a API: ${error}`,
          location: 'N/A'
        }
      ],
      recommendations: ['Verifique sua conexão e tente novamente']
    };
  }
}

/**
 * Envia os resultados da análise para o desenvolvedor
 * Esta função seria implementada para integrar com um sistema de comunicação
 * entre o agente e o desenvolvedor
 */
export function sendAnalysisToAgent(
  analysis: UXAnalysisResult,
  imageBase64?: string,
  feedback?: string
): void {
  // Aqui você implementaria a lógica para enviar os resultados para o desenvolvedor
  console.log("Enviando análise para o agente:", analysis);

  // Exemplo de implementação:
  // 1. Salvar a análise em um banco de dados
  // 2. Notificar o desenvolvedor por email ou outro canal
  // 3. Criar uma tarefa no sistema de gerenciamento de projetos
}
