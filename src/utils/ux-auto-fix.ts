/**
 * UX Auto Fix - Módulo para implementação automática de correções de UX
 * 
 * Este módulo fornece funções para ler logs de análise de UX e implementar
 * automaticamente as correções sugeridas.
 */

import { getAllAnalysisLogs, getAnalysisLogById } from './log-storage';
import { UXAnalysisResult, UXIssue, CodeChange } from './ux-agent';

/**
 * Obtém o log de análise mais recente
 * @returns O log de análise mais recente ou null se não houver logs
 */
export function getLatestAnalysisLog() {
  const logs = getAllAnalysisLogs();
  return logs.length > 0 ? logs[0] : null;
}

/**
 * Extrai as recomendações de um resultado de análise
 * @param analysis Resultado da análise
 * @returns Lista de recomendações
 */
export function extractRecommendations(analysis: UXAnalysisResult): string[] {
  return analysis.recommendations || [];
}

/**
 * Extrai as alterações de código sugeridas de um resultado de análise
 * @param analysis Resultado da análise
 * @returns Lista de alterações de código
 */
export function extractCodeChanges(analysis: UXAnalysisResult): CodeChange[] {
  return analysis.codeChanges || [];
}

/**
 * Classifica os problemas por severidade
 * @param issues Lista de problemas
 * @returns Problemas classificados por severidade (high, medium, low)
 */
export function categorizeIssuesBySeverity(issues: UXIssue[]): {
  high: UXIssue[];
  medium: UXIssue[];
  low: UXIssue[];
} {
  return {
    high: issues.filter(issue => issue.severity === 'high'),
    medium: issues.filter(issue => issue.severity === 'medium'),
    low: issues.filter(issue => issue.severity === 'low')
  };
}

/**
 * Classifica os problemas por tipo
 * @param issues Lista de problemas
 * @returns Problemas classificados por tipo
 */
export function categorizeIssuesByType(issues: UXIssue[]): Record<string, UXIssue[]> {
  const result: Record<string, UXIssue[]> = {};
  
  issues.forEach(issue => {
    if (!result[issue.type]) {
      result[issue.type] = [];
    }
    result[issue.type].push(issue);
  });
  
  return result;
}

/**
 * Gera um plano de ação para corrigir os problemas
 * @param analysis Resultado da análise
 * @returns Plano de ação em formato de texto
 */
export function generateActionPlan(analysis: UXAnalysisResult): string {
  const { issues, recommendations, codeChanges } = analysis;
  
  // Classificar problemas por severidade
  const issuesBySeverity = categorizeIssuesBySeverity(issues);
  
  // Classificar problemas por tipo
  const issuesByType = categorizeIssuesByType(issues);
  
  // Gerar plano de ação
  let plan = '# Plano de Ação para Correção de Problemas de UX\n\n';
  
  // Problemas críticos
  if (issuesBySeverity.high.length > 0) {
    plan += '## Problemas Críticos (Prioridade Alta)\n\n';
    issuesBySeverity.high.forEach((issue, index) => {
      plan += `${index + 1}. **${issue.type}**: ${issue.description}\n`;
      plan += `   - Localização: ${issue.location}\n`;
      if (issue.impact) {
        plan += `   - Impacto: ${issue.impact}\n`;
      }
      plan += '\n';
    });
  }
  
  // Problemas médios
  if (issuesBySeverity.medium.length > 0) {
    plan += '## Problemas Médios (Prioridade Média)\n\n';
    issuesBySeverity.medium.forEach((issue, index) => {
      plan += `${index + 1}. **${issue.type}**: ${issue.description}\n`;
      plan += `   - Localização: ${issue.location}\n`;
      if (issue.impact) {
        plan += `   - Impacto: ${issue.impact}\n`;
      }
      plan += '\n';
    });
  }
  
  // Problemas leves
  if (issuesBySeverity.low.length > 0) {
    plan += '## Problemas Leves (Prioridade Baixa)\n\n';
    issuesBySeverity.low.forEach((issue, index) => {
      plan += `${index + 1}. **${issue.type}**: ${issue.description}\n`;
      plan += `   - Localização: ${issue.location}\n`;
      if (issue.impact) {
        plan += `   - Impacto: ${issue.impact}\n`;
      }
      plan += '\n';
    });
  }
  
  // Recomendações
  if (recommendations && recommendations.length > 0) {
    plan += '## Recomendações Gerais\n\n';
    recommendations.forEach((rec, index) => {
      plan += `${index + 1}. ${rec}\n`;
    });
    plan += '\n';
  }
  
  // Alterações de código
  if (codeChanges && codeChanges.length > 0) {
    plan += '## Alterações de Código Sugeridas\n\n';
    codeChanges.forEach((change, index) => {
      plan += `${index + 1}. Arquivo: \`${change.file}\`\n`;
      plan += `   - Descrição: ${change.description}\n`;
      plan += '   - Código:\n';
      plan += '   ```\n';
      plan += `   ${change.code.replace(/\n/g, '\n   ')}\n`;
      plan += '   ```\n\n';
    });
  }
  
  return plan;
}

/**
 * Gera um resumo dos problemas resolvidos e pendentes
 * @param beforeAnalysis Análise antes das correções
 * @param afterAnalysis Análise após as correções
 * @returns Resumo em formato de texto
 */
export function generateFixSummary(
  beforeAnalysis: UXAnalysisResult,
  afterAnalysis: UXAnalysisResult
): string {
  const beforeIssues = beforeAnalysis.issues;
  const afterIssues = afterAnalysis.issues;
  
  // Contar problemas por severidade antes
  const beforeBySeverity = categorizeIssuesBySeverity(beforeIssues);
  const beforeHighCount = beforeBySeverity.high.length;
  const beforeMediumCount = beforeBySeverity.medium.length;
  const beforeLowCount = beforeBySeverity.low.length;
  const beforeTotalCount = beforeIssues.length;
  
  // Contar problemas por severidade depois
  const afterBySeverity = categorizeIssuesBySeverity(afterIssues);
  const afterHighCount = afterBySeverity.high.length;
  const afterMediumCount = afterBySeverity.medium.length;
  const afterLowCount = afterBySeverity.low.length;
  const afterTotalCount = afterIssues.length;
  
  // Calcular problemas resolvidos
  const resolvedHighCount = beforeHighCount - afterHighCount;
  const resolvedMediumCount = beforeMediumCount - afterMediumCount;
  const resolvedLowCount = beforeLowCount - afterLowCount;
  const resolvedTotalCount = beforeTotalCount - afterTotalCount;
  
  // Gerar resumo
  let summary = '# Resumo das Correções de UX\n\n';
  
  summary += '## Problemas Resolvidos\n\n';
  summary += `- **Problemas Críticos**: ${resolvedHighCount} de ${beforeHighCount} (${Math.round(resolvedHighCount / beforeHighCount * 100) || 0}%)\n`;
  summary += `- **Problemas Médios**: ${resolvedMediumCount} de ${beforeMediumCount} (${Math.round(resolvedMediumCount / beforeMediumCount * 100) || 0}%)\n`;
  summary += `- **Problemas Leves**: ${resolvedLowCount} de ${beforeLowCount} (${Math.round(resolvedLowCount / beforeLowCount * 100) || 0}%)\n`;
  summary += `- **Total**: ${resolvedTotalCount} de ${beforeTotalCount} (${Math.round(resolvedTotalCount / beforeTotalCount * 100) || 0}%)\n\n`;
  
  summary += '## Problemas Pendentes\n\n';
  
  if (afterHighCount > 0) {
    summary += '### Problemas Críticos Pendentes\n\n';
    afterBySeverity.high.forEach((issue, index) => {
      summary += `${index + 1}. **${issue.type}**: ${issue.description}\n`;
      summary += `   - Localização: ${issue.location}\n`;
      if (issue.impact) {
        summary += `   - Impacto: ${issue.impact}\n`;
      }
      summary += '\n';
    });
  }
  
  if (afterMediumCount > 0) {
    summary += '### Problemas Médios Pendentes\n\n';
    afterBySeverity.medium.forEach((issue, index) => {
      summary += `${index + 1}. **${issue.type}**: ${issue.description}\n`;
      summary += `   - Localização: ${issue.location}\n`;
      if (issue.impact) {
        summary += `   - Impacto: ${issue.impact}\n`;
      }
      summary += '\n';
    });
  }
  
  if (afterLowCount > 0) {
    summary += '### Problemas Leves Pendentes\n\n';
    afterBySeverity.low.forEach((issue, index) => {
      summary += `${index + 1}. **${issue.type}**: ${issue.description}\n`;
      summary += `   - Localização: ${issue.location}\n`;
      if (issue.impact) {
        summary += `   - Impacto: ${issue.impact}\n`;
      }
      summary += '\n';
    });
  }
  
  return summary;
}
