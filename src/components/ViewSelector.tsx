import React from 'react';
import { Eye, Code, Terminal, BarChart2 } from 'lucide-react';

export type ViewType = 'preview' | 'code' | 'terminal' | 'analysis';

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  return (
    <div className="view-selector flex items-center bg-black/60 border-b border-orange-500/20 p-1">
      <div className="flex space-x-1">
        <button
          className={`view-button flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            currentView === 'preview'
              ? 'bg-orange-500/20 text-orange-300'
              : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/60'
          }`}
          onClick={() => onViewChange('preview')}
        >
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          Preview
        </button>
        
        <button
          className={`view-button flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            currentView === 'code'
              ? 'bg-orange-500/20 text-orange-300'
              : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/60'
          }`}
          onClick={() => onViewChange('code')}
        >
          <Code className="h-3.5 w-3.5 mr-1.5" />
          Código
        </button>
        
        <button
          className={`view-button flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            currentView === 'terminal'
              ? 'bg-orange-500/20 text-orange-300'
              : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/60'
          }`}
          onClick={() => onViewChange('terminal')}
        >
          <Terminal className="h-3.5 w-3.5 mr-1.5" />
          Terminal
        </button>
        
        <button
          className={`view-button flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            currentView === 'analysis'
              ? 'bg-orange-500/20 text-orange-300'
              : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/60'
          }`}
          onClick={() => onViewChange('analysis')}
        >
          <BarChart2 className="h-3.5 w-3.5 mr-1.5" />
          Análise
        </button>
      </div>
    </div>
  );
}
