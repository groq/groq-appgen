/**
 * Tipos para a estrutura de arquivos
 */

export interface FileTreeItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileTreeItem[];
  content?: string;
  language?: string;
}

export interface TerminalCommand {
  input: string;
  output: string;
  timestamp: Date;
}

export interface AnalysisResult {
  title: string;
  description: string;
  score: number;
  recommendations: string[];
  category: 'performance' | 'accessibility' | 'bestPractices' | 'seo' | 'design';
}
