/**
 * Action Parser
 * 
 * Este módulo fornece funções para analisar e extrair ações de mensagens da IA.
 * As ações podem ser de diferentes tipos, como criação de arquivos ou execução de comandos.
 */

export interface Action {
  type: 'file' | 'shell';
  filePath?: string;
  content: string;
}

/**
 * Analisa uma mensagem e extrai ações
 * @param message Mensagem da IA
 * @returns Lista de ações extraídas
 */
export function parseActions(message: string): Action[] {
  const actions: Action[] = [];
  
  // Regex para extrair ações do formato <action type="file|shell" filePath="...">conteúdo</action>
  const actionRegex = /<action\s+type="(file|shell)"(?:\s+filePath="([^"]*)")?\s*>([\s\S]*?)<\/action>/g;
  
  let match;
  while ((match = actionRegex.exec(message)) !== null) {
    const type = match[1] as 'file' | 'shell';
    const filePath = match[2] || '';
    const content = match[3].trim();
    
    actions.push({
      type,
      ...(type === 'file' && { filePath }),
      content
    });
  }
  
  return actions;
}

/**
 * Analisa uma mensagem e extrai artefatos
 * @param message Mensagem da IA
 * @returns Lista de artefatos extraídos
 */
export function parseArtifacts(message: string): { id: string; title: string; actions: Action[] }[] {
  const artifacts: { id: string; title: string; actions: Action[] }[] = [];
  
  // Regex para extrair artefatos do formato <boltArtifact id="..." title="...">...</boltArtifact>
  const artifactRegex = /<boltArtifact\s+id="([^"]*)"\s+title="([^"]*)">([\s\S]*?)<\/boltArtifact>/g;
  
  let match;
  while ((match = artifactRegex.exec(message)) !== null) {
    const id = match[1];
    const title = match[2];
    const content = match[3];
    
    // Extrair ações do artefato
    const actions = parseActions(content);
    
    artifacts.push({
      id,
      title,
      actions
    });
  }
  
  return artifacts;
}
