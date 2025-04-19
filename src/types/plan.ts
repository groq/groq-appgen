/**
 * Tipos para o sistema de planejamento interativo
 */

/**
 * Prioridade de um item do plano
 */
export type PriorityLevel = 'essencial' | 'importante' | 'desejável';

/**
 * Status de um item do plano
 */
export type ItemStatus = 'pendente' | 'aprovado' | 'rejeitado' | 'modificado';

/**
 * Item individual de uma seção do plano
 */
export interface PlanItem {
  id: string;
  description: string;
  priority: PriorityLevel;
  status?: ItemStatus;
  details?: string;
  userFeedback?: string;
}

/**
 * Seção do plano (ex: Funcionalidades, Design, etc.)
 */
export interface PlanSection {
  name: string;
  items: PlanItem[];
  description?: string;
}

/**
 * Plano completo da aplicação
 */
export interface AppPlan {
  title: string;
  description: string;
  sections: PlanSection[];
  createdAt?: string;
  updatedAt?: string;
  status?: 'rascunho' | 'aprovado' | 'em_implementacao' | 'concluido';
}

/**
 * Histórico de alterações do plano
 */
export interface PlanHistory {
  timestamp: string;
  action: 'criar' | 'atualizar' | 'remover' | 'aprovar';
  sectionName?: string;
  itemId?: string;
  description: string;
  userId?: string;
}

/**
 * Feedback do usuário sobre um item do plano
 */
export interface ItemFeedback {
  itemId: string;
  sectionName: string;
  feedback: string;
  action?: 'aprovar' | 'rejeitar' | 'modificar';
  suggestedChanges?: string;
}

/**
 * Estado do plano no contexto da aplicação
 */
export interface PlanState {
  currentPlan: AppPlan | null;
  history: PlanHistory[];
  isLoading: boolean;
  error: string | null;
  implementationProgress?: number;
}

/**
 * Ação que pode ser realizada em um item do plano
 */
export type PlanItemAction = 
  | { type: 'toggle_status'; sectionName: string; itemId: string }
  | { type: 'update_item'; sectionName: string; itemId: string; updates: Partial<PlanItem> }
  | { type: 'add_item'; sectionName: string; item: Omit<PlanItem, 'id'> }
  | { type: 'remove_item'; sectionName: string; itemId: string }
  | { type: 'provide_feedback'; feedback: ItemFeedback };
