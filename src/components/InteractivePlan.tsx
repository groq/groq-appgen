import React, { useState } from 'react';
import { AppPlan, PlanItem, PlanSection, ItemStatus, PriorityLevel } from '../types/plan';

interface InteractivePlanProps {
  plan: AppPlan;
  onUpdateItem: (sectionName: string, itemId: string, updates: Partial<PlanItem>) => void;
  onAddItem: (sectionName: string, item: Omit<PlanItem, 'id'>) => void;
  onRemoveItem: (sectionName: string, itemId: string) => void;
  onApprove: () => void;
  isEditable?: boolean;
}

const InteractivePlan: React.FC<InteractivePlanProps> = ({
  plan,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  onApprove,
  isEditable = true
}) => {
  const [editingItem, setEditingItem] = useState<{sectionName: string, itemId: string} | null>(null);
  const [newItemSection, setNewItemSection] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState('');
  const [newItemPriority, setNewItemPriority] = useState<PriorityLevel>('importante');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.fromEntries(plan.sections.map(section => [section.name, true]))
  );

  // Alternar expansão de uma seção
  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Alternar status de um item (aprovado/pendente)
  const toggleItemStatus = (sectionName: string, itemId: string, currentStatus?: ItemStatus) => {
    const newStatus: ItemStatus = currentStatus === 'aprovado' ? 'pendente' : 'aprovado';
    onUpdateItem(sectionName, itemId, { status: newStatus });
  };

  // Iniciar edição de um item
  const startEditing = (sectionName: string, itemId: string) => {
    setEditingItem({ sectionName, itemId });
  };

  // Salvar edição de um item
  const saveEdit = (sectionName: string, itemId: string, newDescription: string) => {
    onUpdateItem(sectionName, itemId, { description: newDescription });
    setEditingItem(null);
  };

  // Iniciar adição de novo item
  const startAddingItem = (sectionName: string) => {
    setNewItemSection(sectionName);
    setNewItemText('');
  };

  // Salvar novo item
  const saveNewItem = () => {
    if (newItemSection && newItemText.trim()) {
      onAddItem(newItemSection, {
        description: newItemText.trim(),
        priority: newItemPriority,
        status: 'pendente'
      });
      setNewItemSection(null);
      setNewItemText('');
    }
  };

  // Cancelar edição ou adição
  const cancelEdit = () => {
    setEditingItem(null);
    setNewItemSection(null);
  };

  // Renderizar um item do plano
  const renderItem = (item: PlanItem, sectionName: string, index: number) => {
    const isEditing = editingItem?.sectionName === sectionName && editingItem?.itemId === item.id;
    const itemStatus = item.status || 'pendente';
    
    return (
      <div 
        key={item.id} 
        className={`p-3 mb-2 rounded-md transition-all ${
          itemStatus === 'aprovado' 
            ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' 
            : itemStatus === 'rejeitado'
              ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
              : 'bg-gray-50 dark:bg-gray-800/50 border-l-4 border-gray-300 dark:border-gray-700'
        }`}
      >
        <div className="flex items-start gap-2">
          {isEditable && (
            <input
              type="checkbox"
              checked={itemStatus === 'aprovado'}
              onChange={() => toggleItemStatus(sectionName, item.id, itemStatus)}
              className="mt-1"
            />
          )}
          
          <div className="flex-1">
            {isEditing ? (
              <textarea
                value={item.description}
                onChange={(e) => onUpdateItem(sectionName, item.id, { description: e.target.value })}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                rows={3}
                autoFocus
              />
            ) : (
              <p className={`${itemStatus === 'aprovado' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                {item.description}
              </p>
            )}
            
            <div className="flex items-center mt-2 text-sm">
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                item.priority === 'essencial' 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' 
                  : item.priority === 'importante'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
              }`}>
                {item.priority}
              </span>
              
              {item.userFeedback && (
                <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs italic">
                  Feedback: {item.userFeedback}
                </span>
              )}
            </div>
          </div>
          
          {isEditable && (
            <div className="flex space-x-1">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => saveEdit(sectionName, item.id, item.description)}
                    className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    onClick={cancelEdit}
                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => startEditing(sectionName, item.id)}
                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onRemoveItem(sectionName, item.id)}
                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar formulário para adicionar novo item
  const renderAddItemForm = (sectionName: string) => {
    if (newItemSection !== sectionName) return null;
    
    return (
      <div className="p-3 mb-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
        <textarea
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
          placeholder="Descrição do novo item..."
          rows={2}
          autoFocus
        />
        
        <div className="flex items-center mt-2">
          <select
            value={newItemPriority}
            onChange={(e) => setNewItemPriority(e.target.value as PriorityLevel)}
            className="p-1 border rounded-md mr-2 text-sm dark:bg-gray-800 dark:text-white"
          >
            <option value="essencial">Essencial</option>
            <option value="importante">Importante</option>
            <option value="desejável">Desejável</option>
          </select>
          
          <div className="flex space-x-2 ml-auto">
            <button 
              onClick={saveNewItem}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Adicionar
            </button>
            <button 
              onClick={cancelEdit}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar uma seção do plano
  const renderSection = (section: PlanSection) => {
    const isExpanded = expandedSections[section.name] ?? true;
    
    return (
      <div key={section.name} className="mb-6">
        <div 
          className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-t-md cursor-pointer"
          onClick={() => toggleSection(section.name)}
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {section.name}
          </h3>
          <button className="text-gray-500 dark:text-gray-400">
            {isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        {isExpanded && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-b-md border border-gray-200 dark:border-gray-700 border-t-0">
            {section.items.map((item, index) => renderItem(item, section.name, index))}
            
            {renderAddItemForm(section.name)}
            
            {isEditable && newItemSection !== section.name && (
              <button 
                onClick={() => startAddingItem(section.name)}
                className="mt-2 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Adicionar item
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-500 dark:bg-blue-700">
        <h2 className="text-xl font-bold text-white">{plan.title}</h2>
        <p className="text-blue-100 mt-1">{plan.description}</p>
      </div>
      
      <div className="p-4">
        {plan.sections.map(renderSection)}
        
        {isEditable && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={onApprove}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Aprovar Plano e Iniciar Implementação
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractivePlan;
