/**
 * Log Storage - Módulo para armazenar e recuperar logs de análise de UX
 * 
 * Este módulo fornece funções para salvar e recuperar logs de análise de UX
 * para que possam ser acessados posteriormente.
 */

import { UXAnalysisResult } from './ux-agent';

// Interface para um log de análise
export interface AnalysisLog {
  id: string;
  timestamp: string;
  analysis: UXAnalysisResult;
  imageBase64?: string;
  feedback?: string;
}

// Armazenamento em memória para os logs
const analysisLogs: AnalysisLog[] = [];

/**
 * Salva um log de análise
 * @param analysis Resultado da análise
 * @param imageBase64 Imagem em base64 (opcional)
 * @param feedback Feedback do usuário (opcional)
 * @returns ID do log salvo
 */
export function saveAnalysisLog(
  analysis: UXAnalysisResult,
  imageBase64?: string,
  feedback?: string
): string {
  const id = `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const timestamp = new Date().toISOString();
  
  const log: AnalysisLog = {
    id,
    timestamp,
    analysis,
    imageBase64,
    feedback
  };
  
  analysisLogs.unshift(log); // Adiciona no início para que os mais recentes apareçam primeiro
  
  // Limitar o número de logs armazenados (opcional)
  if (analysisLogs.length > 20) {
    analysisLogs.pop(); // Remove o log mais antigo
  }
  
  // Salvar no localStorage para persistência (se estiver no browser)
  if (typeof window !== 'undefined') {
    try {
      // Salvar apenas os metadados, sem as imagens para economizar espaço
      const logsForStorage = analysisLogs.map(log => ({
        id: log.id,
        timestamp: log.timestamp,
        analysis: log.analysis,
        feedback: log.feedback
      }));
      
      localStorage.setItem('ux_analysis_logs', JSON.stringify(logsForStorage));
    } catch (error) {
      console.error('Erro ao salvar logs no localStorage:', error);
    }
  }
  
  return id;
}

/**
 * Recupera todos os logs de análise
 * @returns Array de logs de análise
 */
export function getAllAnalysisLogs(): AnalysisLog[] {
  return [...analysisLogs];
}

/**
 * Recupera um log de análise específico pelo ID
 * @param id ID do log
 * @returns Log de análise ou null se não encontrado
 */
export function getAnalysisLogById(id: string): AnalysisLog | null {
  return analysisLogs.find(log => log.id === id) || null;
}

/**
 * Gera um relatório de texto formatado a partir de um log de análise
 * @param log Log de análise
 * @returns Relatório formatado em texto
 */
export function generateAnalysisReport(log: AnalysisLog): string {
  const { timestamp, analysis, feedback } = log;
  
  const header = `==== ANÁLISE DE INTERFACE - ${timestamp} ====\n`;
  
  // Resumo
  const summary = `\n--- RESUMO ---\n
Total de problemas: ${analysis.issues.length}
Problemas críticos: ${analysis.issues.filter(i => i.severity === 'high').length}
Problemas médios: ${analysis.issues.filter(i => i.severity === 'medium').length}
Problemas leves: ${analysis.issues.filter(i => i.severity === 'low').length}
${feedback ? `\nFeedback do usuário: ${feedback}` : ''}
`;
  
  // Detalhes dos problemas
  let issuesLog = '\n--- PROBLEMAS IDENTIFICADOS ---\n';
  analysis.issues.forEach((issue, index) => {
    issuesLog += `\n[${index + 1}] ${issue.type.toUpperCase()} (${issue.severity.toUpperCase()})\n`;
    issuesLog += `Descrição: ${issue.description}\n`;
    issuesLog += `Localização: ${issue.location}\n`;
    if (issue.impact) {
      issuesLog += `Impacto: ${issue.impact}\n`;
    }
  });
  
  // Recomendações
  let recommendationsLog = '\n--- RECOMENDAÇÕES ---\n';
  analysis.recommendations.forEach((rec, index) => {
    recommendationsLog += `\n[${index + 1}] ${rec}\n`;
  });
  
  // Alterações de código sugeridas
  let codeChangesLog = '';
  if (analysis.codeChanges && analysis.codeChanges.length > 0) {
    codeChangesLog = '\n--- ALTERAÇÕES DE CÓDIGO SUGERIDAS ---\n';
    analysis.codeChanges.forEach((change, index) => {
      codeChangesLog += `\n[${index + 1}] Arquivo: ${change.file}\n`;
      codeChangesLog += `Descrição: ${change.description}\n`;
      codeChangesLog += `Código:\n${change.code}\n`;
    });
  }
  
  return header + summary + issuesLog + recommendationsLog + codeChangesLog + '\n==== FIM DA ANÁLISE ====\n';
}
