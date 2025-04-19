import React, { useState } from 'react';
import { Edit2, Check, X, Play, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LedEffect } from '@/components/ui/led-effect';

interface PlanStep {
  id: string;
  title: string;
  description: string;
  tasks?: string[];
  isEditing?: boolean;
}

interface PlanArtifactProps {
  title: string;
  description: string;
  steps: PlanStep[];
  onUpdatePlan: (updatedSteps: PlanStep[]) => void;
  onStartExecution: () => void;
  onSendFeedback: (feedback: string) => void;
}

export function PlanningArtifact({
  title,
  description,
  steps,
  onUpdatePlan,
  onStartExecution,
  onSendFeedback
}: PlanArtifactProps) {
  const [localSteps, setLocalSteps] = useState<PlanStep[]>(steps);
  const [feedback, setFeedback] = useState('');
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  
  // Função para atualizar um passo
  const updateStep = (id: string, updates: Partial<PlanStep>) => {
    const updatedSteps = localSteps.map(step => 
      step.id === id ? { ...step, ...updates } : step
    );
    setLocalSteps(updatedSteps);
    onUpdatePlan(updatedSteps);
  };
  
  // Função para iniciar a edição de um passo
  const startEditing = (id: string) => {
    setLocalSteps(localSteps.map(step => 
      step.id === id ? { ...step, isEditing: true } : step
    ));
  };
  
  // Função para cancelar a edição de um passo
  const cancelEditing = (id: string) => {
    setLocalSteps(localSteps.map(step => 
      step.id === id ? { ...step, isEditing: false } : { ...step }
    ));
  };
  
  // Função para enviar feedback
  const handleSendFeedback = () => {
    if (feedback.trim()) {
      onSendFeedback(feedback);
      setFeedback('');
      setShowFeedbackInput(false);
    }
  };
  
  return (
    <div className="planning-artifact bg-black/80 border border-orange-500/30 rounded-lg p-6 max-w-4xl mx-auto">
      <LedEffect
        active={true}
        color="orange"
        intensity="low"
        pulse={false}
        className="w-full"
      >
        <div className="artifact-header mb-6">
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
      </LedEffect>
      
      <div className="artifact-steps space-y-4 mb-6">
        {localSteps.map((step, index) => (
          <div 
            key={step.id} 
            className="step bg-black/60 border border-orange-500/20 rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="step-number w-6 h-6 rounded-full bg-orange-500/20 text-orange-300 flex items-center justify-center text-xs mr-3">
                  {index + 1}
                </div>
                {step.isEditing ? (
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(step.id, { title: e.target.value })}
                    className="bg-black/80 border border-orange-500/30 text-white rounded px-2 py-1 text-sm w-full"
                  />
                ) : (
                  <h3 className="text-white font-medium">{step.title}</h3>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {step.isEditing ? (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                      onClick={() => updateStep(step.id, { isEditing: false })}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={() => cancelEditing(step.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
                    onClick={() => startEditing(step.id)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-2 pl-9">
              {step.isEditing ? (
                <textarea
                  value={step.description}
                  onChange={(e) => updateStep(step.id, { description: e.target.value })}
                  className="bg-black/80 border border-orange-500/30 text-gray-300 rounded px-2 py-1 text-sm w-full min-h-[60px] resize-none"
                />
              ) : (
                <p className="text-gray-300 text-sm">{step.description}</p>
              )}
              
              {step.tasks && step.tasks.length > 0 && (
                <div className="mt-3 space-y-1">
                  {step.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex items-start">
                      {step.isEditing ? (
                        <input
                          type="text"
                          value={task}
                          onChange={(e) => {
                            const newTasks = [...step.tasks!];
                            newTasks[taskIndex] = e.target.value;
                            updateStep(step.id, { tasks: newTasks });
                          }}
                          className="bg-black/80 border border-orange-500/30 text-gray-300 rounded px-2 py-1 text-xs w-full"
                        />
                      ) : (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50 mt-1.5 mr-2"></div>
                          <span className="text-gray-400 text-xs">{task}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="artifact-actions flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-orange-300 hover:text-orange-200 hover:bg-orange-500/10 border border-orange-500/30"
          onClick={() => setShowFeedbackInput(!showFeedbackInput)}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Editar Plano
        </Button>
        
        <Button
          className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
          onClick={onStartExecution}
        >
          <Play className="h-4 w-4 mr-2" />
          Iniciar Desenvolvimento
        </Button>
      </div>
      
      {showFeedbackInput && (
        <div className="mt-4">
          <div className="relative">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Descreva as alterações que você deseja fazer no plano..."
              className="w-full bg-black/60 border border-orange-500/30 text-gray-200 rounded-lg px-4 py-2 pr-12 resize-none min-h-[80px] focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 placeholder-gray-500 text-sm"
            />
            <Button
              className="absolute right-2 bottom-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 h-8 w-8 p-0"
              onClick={handleSendFeedback}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
