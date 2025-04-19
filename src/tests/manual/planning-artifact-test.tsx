import React, { useState } from 'react';
import { PlanningArtifact } from '@/components/PlanningArtifact';

export default function PlanningArtifactTest() {
  const [steps, setSteps] = useState([
    {
      id: 'step1',
      title: 'Configurar o projeto',
      description: 'Inicializar o projeto e instalar dependências',
      tasks: [
        'Criar estrutura de diretórios',
        'Instalar React e dependências',
        'Configurar ESLint e Prettier'
      ]
    },
    {
      id: 'step2',
      title: 'Implementar componentes básicos',
      description: 'Criar os componentes fundamentais da aplicação',
      tasks: [
        'Criar componente Header',
        'Criar componente Footer',
        'Criar componente Layout'
      ]
    },
    {
      id: 'step3',
      title: 'Implementar funcionalidades principais',
      description: 'Desenvolver as funcionalidades principais da aplicação',
      tasks: [
        'Implementar autenticação',
        'Implementar CRUD de usuários',
        'Implementar dashboard'
      ]
    }
  ]);
  
  const [logs, setLogs] = useState<string[]>([]);
  
  const handleUpdatePlan = (updatedSteps: any[]) => {
    setSteps(updatedSteps);
    setLogs(prev => [...prev, `Plano atualizado: ${JSON.stringify(updatedSteps.map(s => s.title))}`]);
  };
  
  const handleStartExecution = () => {
    setLogs(prev => [...prev, 'Execução iniciada!']);
  };
  
  const handleSendFeedback = (feedback: string) => {
    setLogs(prev => [...prev, `Feedback enviado: ${feedback}`]);
  };
  
  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-8">Teste do PlanningArtifact</h1>
      
      <div className="mb-8">
        <PlanningArtifact
          title="Plano de Desenvolvimento"
          description="Aplicação React com autenticação e dashboard"
          steps={steps}
          onUpdatePlan={handleUpdatePlan}
          onStartExecution={handleStartExecution}
          onSendFeedback={handleSendFeedback}
        />
      </div>
      
      <div className="bg-black/80 border border-orange-500/30 rounded-lg p-4 mt-8">
        <h2 className="text-lg font-bold text-white mb-4">Logs</h2>
        <div className="text-gray-300 font-mono text-sm">
          {logs.length === 0 ? (
            <p className="text-gray-500">Nenhuma ação registrada</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="py-1 border-b border-gray-800">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
