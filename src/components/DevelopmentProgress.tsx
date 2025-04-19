import React from 'react';
import { Check, Clock, AlertCircle, Loader, FileCode, Terminal } from 'lucide-react';
import { LedEffect } from '@/components/ui/led-effect';

export interface ProgressStep {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'complete' | 'failed';
  description?: string;
  error?: string;
}

interface DevelopmentProgressProps {
  steps: ProgressStep[];
  files: {
    path: string;
    content: string;
  }[];
  commands: string[];
  onViewFile: (path: string) => void;
  onRunCommand: (command: string) => void;
}

export function DevelopmentProgress({
  steps,
  files,
  commands,
  onViewFile,
  onRunCommand
}: DevelopmentProgressProps) {
  // Calcular o progresso geral
  const completedSteps = steps.filter(step => step.status === 'complete').length;
  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  // Verificar se há algum passo em execução
  const isRunning = steps.some(step => step.status === 'running');

  // Verificar se há algum passo com falha
  const hasFailed = steps.some(step => step.status === 'failed');

  return (
    <LedEffect
      active={isRunning}
      color={hasFailed ? 'red' : 'orange'}
      intensity="low"
      pulse={isRunning}
      className="w-full"
    >
      <div className="development-progress bg-black/80 border border-orange-500/30 rounded-lg p-4">
      <div className="progress-header mb-4">
        <h3 className="text-white text-sm font-medium mb-2">Progresso do Desenvolvimento</h3>

        <div className="progress-bar h-2 bg-gray-800 rounded-full overflow-hidden">
          <LedEffect
            active={isRunning}
            color={hasFailed ? 'red' : 'orange'}
            intensity="medium"
            pulse={isRunning}
            className="h-full"
          >
            <div
              className={`h-full ${hasFailed ? 'bg-red-500' : 'bg-orange-500'} transition-all duration-300`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </LedEffect>
        </div>

        <div className="progress-stats flex justify-between mt-1">
          <span className="text-xs text-gray-400">{completedSteps} de {totalSteps} etapas concluídas</span>
          <span className="text-xs text-gray-400">{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      <div className="progress-steps space-y-3 mb-4">
        {steps.map(step => (
          <div
            key={step.id}
            className={`step p-3 rounded-lg border ${
              step.status === 'complete' ? 'border-green-500/30 bg-green-500/10' :
              step.status === 'running' ? 'border-orange-500/30 bg-orange-500/10' :
              step.status === 'failed' ? 'border-red-500/30 bg-red-500/10' :
              'border-gray-700 bg-black/40'
            }`}
          >
            <div className="flex items-start">
              <div className="step-icon mr-3 mt-0.5">
                {step.status === 'complete' && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {step.status === 'running' && (
                  <Loader className="h-4 w-4 text-orange-500 animate-spin" />
                )}
                {step.status === 'pending' && (
                  <Clock className="h-4 w-4 text-gray-500" />
                )}
                {step.status === 'failed' && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>

              <div className="step-content flex-1">
                <h4 className={`text-sm font-medium ${
                  step.status === 'complete' ? 'text-green-300' :
                  step.status === 'running' ? 'text-orange-300' :
                  step.status === 'failed' ? 'text-red-300' :
                  'text-gray-300'
                }`}>
                  {step.title}
                </h4>

                {step.description && (
                  <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                )}

                {step.error && (
                  <div className="error-message mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-300">
                    {step.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {files.length > 0 && (
        <div className="files-section mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Arquivos Gerados</h4>

          <div className="files-list space-y-1">
            {files.map(file => (
              <button
                key={file.path}
                className="file-item flex items-center w-full p-2 rounded-lg hover:bg-gray-800/60 text-left"
                onClick={() => onViewFile(file.path)}
              >
                <FileCode className="h-3.5 w-3.5 text-orange-400 mr-2" />
                <span className="text-xs text-gray-300 truncate">{file.path}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {commands.length > 0 && (
        <div className="commands-section">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Comandos Sugeridos</h4>

          <div className="commands-list space-y-1">
            {commands.map((command, index) => (
              <button
                key={index}
                className="command-item flex items-center w-full p-2 rounded-lg hover:bg-gray-800/60 text-left"
                onClick={() => onRunCommand(command)}
              >
                <Terminal className="h-3.5 w-3.5 text-orange-400 mr-2" />
                <span className="text-xs text-gray-300 font-mono">{command}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
    </LedEffect>
  );
}
