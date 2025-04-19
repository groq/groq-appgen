import React from 'react';
import { Clock, Loader, Check, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export interface Step {
  title: string;
  status: 'pending' | 'running' | 'complete' | 'failed';
  description?: string;
  code?: string;
  error?: string;
}

interface ProgressCardsProps {
  steps: Step[];
}

export function ProgressCards({ steps }: ProgressCardsProps) {
  const [expandedStep, setExpandedStep] = React.useState<number | null>(null);
  
  const toggleStep = (index: number) => {
    if (expandedStep === index) {
      setExpandedStep(null);
    } else {
      setExpandedStep(index);
    }
  };
  
  return (
    <div className="progress-cards space-y-2">
      {steps.map((step, index) => (
        <div 
          key={index} 
          className={`progress-card border rounded-md overflow-hidden transition-all duration-200 ${
            step.status === 'running' ? 'border-orange-500/50 bg-orange-500/5' :
            step.status === 'complete' ? 'border-green-500/30 bg-green-500/5' :
            step.status === 'failed' ? 'border-red-500/30 bg-red-500/5' :
            'border-gray-700 bg-black/40'
          }`}
        >
          <div 
            className="card-header flex items-center justify-between p-2 cursor-pointer"
            onClick={() => toggleStep(index)}
          >
            <div className="flex items-center gap-2">
              <div className="step-status w-5 h-5 flex items-center justify-center">
                {step.status === 'pending' && <Clock className="text-gray-400 h-4 w-4" />}
                {step.status === 'running' && <Loader className="text-orange-400 h-4 w-4 animate-spin" />}
                {step.status === 'complete' && <Check className="text-green-400 h-4 w-4" />}
                {step.status === 'failed' && <AlertTriangle className="text-red-400 h-4 w-4" />}
              </div>
              <div className="step-title text-sm font-medium">
                {step.title}
              </div>
            </div>
            <div className="toggle-icon">
              {expandedStep === index ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
          
          {expandedStep === index && step.description && (
            <div className="card-details p-2 pt-0 border-t border-gray-800">
              <div className="step-description text-xs text-gray-300 mt-2">
                {step.description}
              </div>
              
              {step.code && (
                <div className="step-code mt-2 bg-black/60 p-2 rounded text-xs font-mono text-gray-300 overflow-x-auto">
                  <pre>{step.code}</pre>
                </div>
              )}
              
              {step.error && (
                <div className="step-error mt-2 bg-red-900/20 border border-red-900/30 p-2 rounded text-xs text-red-300">
                  {step.error}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
