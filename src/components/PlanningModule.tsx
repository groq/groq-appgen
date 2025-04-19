import React, { useState } from 'react';
import { ClipboardList, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ObjectivesForm } from './planning/ObjectivesForm';
import { RequirementsForm } from './planning/RequirementsForm';
import { TechnologiesForm } from './planning/TechnologiesForm';
import { ArchitectureForm } from './planning/ArchitectureForm';
import { ImplementationPlan } from './planning/ImplementationPlan';

export interface PlanData {
  objectives: {
    title?: string;
    description?: string;
    targetAudience?: string;
  };
  requirements: {
    id: string;
    description: string;
    priority: 'essencial' | 'importante' | 'desejável';
  }[];
  technologies: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    deployment?: string[];
  };
  architecture: {
    components?: string[];
    dataFlow?: string;
    diagram?: string;
  };
  implementation: {
    id: string;
    step: string;
    description: string;
    estimatedTime: string;
  }[];
}

interface PlanningStep {
  number: number;
  total: number;
  title: string;
  type: 'objectives' | 'requirements' | 'technologies' | 'architecture' | 'implementation';
}

interface PlanningModuleProps {
  onUpdatePlan: (section: keyof PlanData, data: any) => void;
  onFinishPlanning: (plan: PlanData) => void;
  planData: PlanData;
}

export function PlanningModule({ onUpdatePlan, onFinishPlanning, planData }: PlanningModuleProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const steps: PlanningStep[] = [
    { number: 1, total: 5, title: 'Definição de Objetivos', type: 'objectives' },
    { number: 2, total: 5, title: 'Requisitos Funcionais', type: 'requirements' },
    { number: 3, total: 5, title: 'Tecnologias', type: 'technologies' },
    { number: 4, total: 5, title: 'Arquitetura', type: 'architecture' },
    { number: 5, total: 5, title: 'Plano de Implementação', type: 'implementation' },
  ];
  
  const currentStep = steps[currentStepIndex];
  
  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onFinishPlanning(planData);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'objectives':
        return (
          <ObjectivesForm
            data={planData.objectives}
            onUpdate={(data) => onUpdatePlan('objectives', data)}
          />
        );
      case 'requirements':
        return (
          <RequirementsForm
            data={planData.requirements}
            onUpdate={(data) => onUpdatePlan('requirements', data)}
          />
        );
      case 'technologies':
        return (
          <TechnologiesForm
            data={planData.technologies}
            onUpdate={(data) => onUpdatePlan('technologies', data)}
          />
        );
      case 'architecture':
        return (
          <ArchitectureForm
            data={planData.architecture}
            onUpdate={(data) => onUpdatePlan('architecture', data)}
          />
        );
      case 'implementation':
        return (
          <ImplementationPlan
            data={planData.implementation}
            onUpdate={(data) => onUpdatePlan('implementation', data)}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="planning-module w-full max-w-xl bg-black/60 border border-orange-500/30 rounded-lg overflow-hidden mb-4">
      <div className="planning-header p-3 border-b border-orange-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ClipboardList className="h-4 w-4 text-orange-400 mr-2" />
            <h3 className="text-sm text-gray-200 font-medium">Planejamento do Projeto</h3>
          </div>
        </div>
        
        <div className="step-indicator flex items-center justify-between mt-2">
          <div className="text-xs text-gray-400">
            Etapa {currentStep.number} de {currentStep.total}
          </div>
          <div className="text-xs text-orange-300 font-medium">
            {currentStep.title}
          </div>
        </div>
        
        <div className="step-progress h-1 bg-gray-800 mt-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${(currentStep.number / currentStep.total) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="planning-content p-3">
        {renderStepContent()}
      </div>
      
      <div className="planning-actions p-3 border-t border-orange-500/20 flex justify-between">
        <Button
          className="text-xs py-1 h-auto bg-black/40 border border-gray-700 hover:bg-gray-800 text-gray-300"
          onClick={handlePreviousStep}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft className="h-3 w-3 mr-1" />
          Anterior
        </Button>
        
        <Button
          className="text-xs py-1 h-auto bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
          onClick={handleNextStep}
        >
          {currentStepIndex === steps.length - 1 ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Finalizar
            </>
          ) : (
            <>
              Próximo
              <ChevronRight className="h-3 w-3 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
