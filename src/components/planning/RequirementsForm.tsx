import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Requirement {
  id: string;
  description: string;
  priority: 'essencial' | 'importante' | 'desejável';
}

interface RequirementsFormProps {
  data: Requirement[];
  onUpdate: (data: Requirement[]) => void;
}

export function RequirementsForm({ data, onUpdate }: RequirementsFormProps) {
  const [requirements, setRequirements] = useState<Requirement[]>(data || []);
  
  // Atualizar o formulário quando os dados externos mudarem
  useEffect(() => {
    setRequirements(data || []);
  }, [data]);
  
  // Adicionar um novo requisito
  const addRequirement = () => {
    const newRequirement: Requirement = {
      id: uuidv4(),
      description: '',
      priority: 'importante'
    };
    
    const updatedRequirements = [...requirements, newRequirement];
    setRequirements(updatedRequirements);
    onUpdate(updatedRequirements);
  };
  
  // Remover um requisito
  const removeRequirement = (id: string) => {
    const updatedRequirements = requirements.filter(req => req.id !== id);
    setRequirements(updatedRequirements);
    onUpdate(updatedRequirements);
  };
  
  // Atualizar um requisito
  const updateRequirement = (id: string, field: keyof Requirement, value: any) => {
    const updatedRequirements = requirements.map(req => {
      if (req.id === id) {
        return { ...req, [field]: value };
      }
      return req;
    });
    
    setRequirements(updatedRequirements);
    onUpdate(updatedRequirements);
  };
  
  return (
    <div className="requirements-form space-y-4">
      <div className="text-xs text-gray-300 mb-2">
        Defina os requisitos funcionais do seu projeto. Cada requisito deve descrever uma funcionalidade específica que o sistema deve ter.
      </div>
      
      {requirements.length === 0 ? (
        <div className="text-center py-4 border border-dashed border-gray-700 rounded-md">
          <p className="text-xs text-gray-400 mb-2">Nenhum requisito definido</p>
          <Button
            size="sm"
            className="text-xs py-1 h-auto bg-black/40 border border-gray-700 hover:bg-gray-800 text-gray-300"
            onClick={addRequirement}
          >
            <Plus className="h-3 w-3 mr-1" />
            Adicionar Requisito
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {requirements.map((req) => (
            <div key={req.id} className="requirement-item border border-gray-800 rounded-md p-2 bg-black/40">
              <div className="flex justify-between items-start mb-2">
                <select
                  value={req.priority}
                  onChange={(e) => updateRequirement(req.id, 'priority', e.target.value)}
                  className="text-xs bg-black/60 border border-gray-700 rounded p-1 text-gray-300"
                >
                  <option value="essencial">Essencial</option>
                  <option value="importante">Importante</option>
                  <option value="desejável">Desejável</option>
                </select>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-400 hover:bg-transparent"
                  onClick={() => removeRequirement(req.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              <Textarea
                value={req.description}
                onChange={(e) => updateRequirement(req.id, 'description', e.target.value)}
                placeholder="Descreva o requisito..."
                className="w-full bg-black/60 border-gray-800 text-gray-200 text-xs min-h-[60px]"
              />
            </div>
          ))}
          
          <div className="flex justify-center">
            <Button
              size="sm"
              className="text-xs py-1 h-auto bg-black/40 border border-gray-700 hover:bg-gray-800 text-gray-300"
              onClick={addRequirement}
            >
              <Plus className="h-3 w-3 mr-1" />
              Adicionar Requisito
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
