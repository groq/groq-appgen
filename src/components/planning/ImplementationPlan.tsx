import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ImplementationStep {
  id: string;
  step: string;
  description: string;
  estimatedTime: string;
}

interface ImplementationPlanProps {
  data: ImplementationStep[];
  onUpdate: (data: ImplementationStep[]) => void;
}

export function ImplementationPlan({ data, onUpdate }: ImplementationPlanProps) {
  const [steps, setSteps] = useState<ImplementationStep[]>(data || []);
  
  // Atualizar o formulário quando os dados externos mudarem
  useEffect(() => {
    setSteps(data || []);
  }, [data]);
  
  // Adicionar um novo passo
  const addStep = () => {
    const newStep: ImplementationStep = {
      id: uuidv4(),
      step: `Etapa ${steps.length + 1}`,
      description: '',
      estimatedTime: '1 hora'
    };
    
    const updatedSteps = [...steps, newStep];
    setSteps(updatedSteps);
    onUpdate(updatedSteps);
  };
  
  // Remover um passo
  const removeStep = (id: string) => {
    const updatedSteps = steps.filter(step => step.id !== id);
    setSteps(updatedSteps);
    onUpdate(updatedSteps);
  };
  
  // Atualizar um passo
  const updateStep = (id: string, field: keyof ImplementationStep, value: string) => {
    const updatedSteps = steps.map(step => {
      if (step.id === id) {
        return { ...step, [field]: value };
      }
      return step;
    });
    
    setSteps(updatedSteps);
    onUpdate(updatedSteps);
  };
  
  // Mover um passo para cima
  const moveStepUp = (index: number) => {
    if (index === 0) return;
    
    const updatedSteps = [...steps];
    const temp = updatedSteps[index];
    updatedSteps[index] = updatedSteps[index - 1];
    updatedSteps[index - 1] = temp;
    
    setSteps(updatedSteps);
    onUpdate(updatedSteps);
  };
  
  // Mover um passo para baixo
  const moveStepDown = (index: number) => {
    if (index === steps.length - 1) return;
    
    const updatedSteps = [...steps];
    const temp = updatedSteps[index];
    updatedSteps[index] = updatedSteps[index + 1];
    updatedSteps[index + 1] = temp;
    
    setSteps(updatedSteps);
    onUpdate(updatedSteps);
  };
  
  return (
    <div className="implementation-plan space-y-4">
      <div className="text-xs text-gray-300 mb-2">
        Defina as etapas de implementação do seu projeto. Organize-as na ordem em que devem ser executadas.
      </div>
      
      {steps.length === 0 ? (
        <div className="text-center py-4 border border-dashed border-gray-700 rounded-md">
          <p className="text-xs text-gray-400 mb-2">Nenhuma etapa definida</p>
          <Button
            size="sm"
            className="text-xs py-1 h-auto bg-black/40 border border-gray-700 hover:bg-gray-800 text-gray-300"
            onClick={addStep}
          >
            <Plus className="h-3 w-3 mr-1" />
            Adicionar Etapa
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="step-item border border-gray-800 rounded-md p-2 bg-black/40">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="step-number bg-orange-500/20 text-orange-300 text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                  <Input
                    value={step.step}
                    onChange={(e) => updateStep(step.id, 'step', e.target.value)}
                    placeholder="Nome da etapa"
                    className="bg-black/60 border-gray-800 text-gray-200 text-xs h-7"
                  />
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
                    onClick={() => moveStepUp(index)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
                    onClick={() => moveStepDown(index)}
                    disabled={index === steps.length - 1}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-400 hover:bg-transparent"
                    onClick={() => removeStep(step.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={step.description}
                onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                placeholder="Descreva o que será feito nesta etapa..."
                className="w-full bg-black/60 border-gray-800 text-gray-200 text-xs min-h-[60px] mb-2"
              />
              
              <div className="flex items-center">
                <label className="text-xs text-gray-400 mr-2">Tempo estimado:</label>
                <Input
                  value={step.estimatedTime}
                  onChange={(e) => updateStep(step.id, 'estimatedTime', e.target.value)}
                  placeholder="Ex: 2 horas"
                  className="bg-black/60 border-gray-800 text-gray-200 text-xs h-7 w-32"
                />
              </div>
            </div>
          ))}
          
          <div className="flex justify-center">
            <Button
              size="sm"
              className="text-xs py-1 h-auto bg-black/40 border border-gray-700 hover:bg-gray-800 text-gray-300"
              onClick={addStep}
            >
              <Plus className="h-3 w-3 mr-1" />
              Adicionar Etapa
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
