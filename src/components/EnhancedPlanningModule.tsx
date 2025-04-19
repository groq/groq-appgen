import React, { useState, useEffect } from 'react';
import { PlanningModule, PlanData } from './PlanningModule';
import { PlanningArtifact } from './PlanningArtifact';

interface EnhancedPlanningModuleProps {
  onUpdatePlan: (section: keyof PlanData, data: any) => void;
  onFinishPlanning: (plan: PlanData) => void;
  planData: PlanData;
  initialMode?: 'form' | 'artifact';
}

export function EnhancedPlanningModule({
  onUpdatePlan,
  onFinishPlanning,
  planData,
  initialMode = 'artifact'
}: EnhancedPlanningModuleProps) {
  const [mode, setMode] = useState<'form' | 'artifact'>(initialMode);
  const [planSteps, setPlanSteps] = useState<any[]>([]);

  // Converter o planData para o formato do PlanningArtifact
  useEffect(() => {
    const steps = [];

    // Objetivos
    if (planData.objectives) {
      steps.push({
        id: 'objectives',
        title: 'Definição de Objetivos',
        description: `${planData.objectives.title || 'Aplicação'}: ${planData.objectives.description || 'Sem descrição'}`,
        tasks: [
          `Público-alvo: ${planData.objectives.targetAudience || 'Não especificado'}`
        ]
      });
    }

    // Requisitos
    if (planData.requirements && planData.requirements.length > 0) {
      steps.push({
        id: 'requirements',
        title: 'Requisitos Funcionais',
        description: 'Lista de funcionalidades necessárias para a aplicação',
        tasks: planData.requirements.map(req => `${req.description} (${req.priority})`)
      });
    }

    // Tecnologias
    if (planData.technologies) {
      const techTasks = [];
      if (planData.technologies.frontend) techTasks.push(`Frontend: ${planData.technologies.frontend.join(', ')}`);
      if (planData.technologies.backend) techTasks.push(`Backend: ${planData.technologies.backend.join(', ')}`);
      if (planData.technologies.database) techTasks.push(`Database: ${planData.technologies.database.join(', ')}`);
      if (planData.technologies.deployment) techTasks.push(`Deployment: ${planData.technologies.deployment.join(', ')}`);

      steps.push({
        id: 'technologies',
        title: 'Stack Tecnológica',
        description: 'Tecnologias selecionadas para o desenvolvimento',
        tasks: techTasks
      });
    }

    // Arquitetura
    if (planData.architecture) {
      const archTasks = [];
      if (planData.architecture.components) archTasks.push(`Componentes: ${planData.architecture.components.join(', ')}`);
      if (planData.architecture.dataFlow) archTasks.push(`Fluxo de dados: ${planData.architecture.dataFlow}`);

      steps.push({
        id: 'architecture',
        title: 'Arquitetura da Aplicação',
        description: 'Estrutura e organização dos componentes',
        tasks: archTasks
      });
    }

    // Implementação
    if (planData.implementation && planData.implementation.length > 0) {
      steps.push({
        id: 'implementation',
        title: 'Plano de Implementação',
        description: 'Etapas para o desenvolvimento da aplicação',
        tasks: planData.implementation.map(imp => `${imp.step}: ${imp.description} (${imp.estimatedTime})`)
      });
    }

    setPlanSteps(steps);
  }, [planData]);

  // Função para atualizar o plano a partir do artefato
  const handleUpdatePlanFromArtifact = (updatedSteps: any[]) => {
    // Mapear as alterações de volta para o formato PlanData
    const updatedPlanData = { ...planData };

    // Atualizar objetivos
    const objectivesStep = updatedSteps.find(step => step.id === 'objectives');
    if (objectivesStep) {
      const titleMatch = objectivesStep.description.match(/^([^:]+):/i);
      const descriptionMatch = objectivesStep.description.match(/^[^:]+:\s*(.+)$/i);
      const targetAudienceMatch = objectivesStep.tasks?.[0]?.match(/Público-alvo:\s*(.+)$/i);

      if (titleMatch && titleMatch[1]) {
        updatedPlanData.objectives.title = titleMatch[1].trim();
      }

      if (descriptionMatch && descriptionMatch[1]) {
        updatedPlanData.objectives.description = descriptionMatch[1].trim();
      }

      if (targetAudienceMatch && targetAudienceMatch[1]) {
        updatedPlanData.objectives.targetAudience = targetAudienceMatch[1].trim();
      }
    }

    // Atualizar requisitos
    const requirementsStep = updatedSteps.find(step => step.id === 'requirements');
    if (requirementsStep && requirementsStep.tasks) {
      updatedPlanData.requirements = requirementsStep.tasks.map((task, index) => {
        const priorityMatch = task.match(/\(([^)]+)\)$/i);
        const description = task.replace(/\([^)]+\)$/i, '').trim();

        return {
          id: `req-${index + 1}`,
          description,
          priority: priorityMatch ? priorityMatch[1].trim() : 'Medium'
        };
      });
    }

    // Atualizar tecnologias
    const technologiesStep = updatedSteps.find(step => step.id === 'technologies');
    if (technologiesStep && technologiesStep.tasks) {
      technologiesStep.tasks.forEach(task => {
        const frontendMatch = task.match(/^Frontend:\s*(.+)$/i);
        const backendMatch = task.match(/^Backend:\s*(.+)$/i);
        const databaseMatch = task.match(/^Database:\s*(.+)$/i);
        const deploymentMatch = task.match(/^Deployment:\s*(.+)$/i);

        if (frontendMatch && frontendMatch[1]) {
          updatedPlanData.technologies.frontend = frontendMatch[1].split(',').map(t => t.trim());
        }

        if (backendMatch && backendMatch[1]) {
          updatedPlanData.technologies.backend = backendMatch[1].split(',').map(t => t.trim());
        }

        if (databaseMatch && databaseMatch[1]) {
          updatedPlanData.technologies.database = databaseMatch[1].split(',').map(t => t.trim());
        }

        if (deploymentMatch && deploymentMatch[1]) {
          updatedPlanData.technologies.deployment = deploymentMatch[1].split(',').map(t => t.trim());
        }
      });
    }

    // Atualizar arquitetura
    const architectureStep = updatedSteps.find(step => step.id === 'architecture');
    if (architectureStep && architectureStep.tasks) {
      architectureStep.tasks.forEach(task => {
        const componentsMatch = task.match(/^Componentes:\s*(.+)$/i);
        const dataFlowMatch = task.match(/^Fluxo de dados:\s*(.+)$/i);

        if (componentsMatch && componentsMatch[1]) {
          updatedPlanData.architecture.components = componentsMatch[1].split(',').map(t => t.trim());
        }

        if (dataFlowMatch && dataFlowMatch[1]) {
          updatedPlanData.architecture.dataFlow = dataFlowMatch[1].trim();
        }
      });
    }

    // Atualizar implementação
    const implementationStep = updatedSteps.find(step => step.id === 'implementation');
    if (implementationStep && implementationStep.tasks) {
      updatedPlanData.implementation = implementationStep.tasks.map((task, index) => {
        const stepMatch = task.match(/^([^:]+):/i);
        const descriptionMatch = task.match(/^[^:]+:\s*(.+)\s*\([^)]+\)$/i);
        const timeMatch = task.match(/\(([^)]+)\)$/i);

        return {
          id: `imp-${index + 1}`,
          step: stepMatch ? stepMatch[1].trim() : `Passo ${index + 1}`,
          description: descriptionMatch ? descriptionMatch[1].trim() : task,
          estimatedTime: timeMatch ? timeMatch[1].trim() : '1h'
        };
      });
    }

    // Atualizar o plano
    onUpdatePlan('objectives', updatedPlanData.objectives);
    onUpdatePlan('requirements', updatedPlanData.requirements);
    onUpdatePlan('technologies', updatedPlanData.technologies);
    onUpdatePlan('architecture', updatedPlanData.architecture);
    onUpdatePlan('implementation', updatedPlanData.implementation);
  };

  // Função para enviar feedback sobre o plano
  const handleSendFeedback = (feedback: string) => {
    // Aqui você enviaria o feedback para a IA e atualizaria o plano
    console.log('Feedback enviado:', feedback);
  };

  return (
    <div className="enhanced-planning-module">
      {mode === 'form' ? (
        <div className="form-mode">
          <PlanningModule
            onUpdatePlan={onUpdatePlan}
            onFinishPlanning={onFinishPlanning}
            planData={planData}
          />

          <div className="text-center mt-4">
            <button
              className="text-xs text-orange-300 hover:text-orange-200 underline"
              onClick={() => setMode('artifact')}
            >
              Ver visualização simplificada
            </button>
          </div>
        </div>
      ) : (
        <div className="artifact-mode">
          <PlanningArtifact
            title="Plano de Desenvolvimento"
            description={`${planData.objectives.title || 'Aplicação'}: ${planData.objectives.description || 'Sem descrição'}`}
            steps={planSteps}
            onUpdatePlan={handleUpdatePlanFromArtifact}
            onStartExecution={() => onFinishPlanning(planData)}
            onSendFeedback={handleSendFeedback}
          />

          <div className="text-center mt-4">
            <button
              className="text-xs text-orange-300 hover:text-orange-200 underline"
              onClick={() => setMode('form')}
            >
              Editar detalhes do plano
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
