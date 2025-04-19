import React from 'react';
import { Check, X, ExternalLink, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Result {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  data?: any;
  actions?: ResultAction[];
}

export interface ResultAction {
  id: string;
  label: string;
  icon: 'open' | 'download' | 'copy' | 'view';
  url?: string;
}

interface ResultPanelProps {
  result: Result;
  onAction?: (action: ResultAction) => void;
}

export function ResultPanel({ result, onAction }: ResultPanelProps) {
  const { type, title, message, actions } = result;
  
  const getIconByType = () => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-400" />;
      case 'error':
        return <X className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <div className="h-5 w-5 text-yellow-400">⚠️</div>;
      case 'info':
        return <div className="h-5 w-5 text-blue-400">ℹ️</div>;
      default:
        return null;
    }
  };
  
  const getColorByType = () => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/30 bg-blue-500/10';
      default:
        return 'border-gray-700 bg-black/40';
    }
  };
  
  const getIconByAction = (icon: string) => {
    switch (icon) {
      case 'open':
        return <ExternalLink className="h-3 w-3" />;
      case 'download':
        return <Download className="h-3 w-3" />;
      case 'copy':
        return <Copy className="h-3 w-3" />;
      case 'view':
        return <div className="h-3 w-3">👁️</div>;
      default:
        return null;
    }
  };
  
  return (
    <div className={`result-panel border rounded-md overflow-hidden ${getColorByType()}`}>
      <div className="result-header flex items-center gap-2 p-3 border-b border-gray-800">
        {getIconByType()}
        <h4 className="text-sm font-medium">{title}</h4>
      </div>
      
      <div className="result-content p-3">
        <p className="text-xs text-gray-300 whitespace-pre-line">{message}</p>
        
        {actions && actions.length > 0 && (
          <div className="result-actions flex flex-wrap gap-2 mt-3">
            {actions.map((action) => (
              <Button
                key={action.id}
                size="sm"
                variant="outline"
                className="text-xs py-1 h-auto bg-black/40 border-gray-700 hover:bg-gray-800"
                onClick={() => onAction && onAction(action)}
              >
                {getIconByAction(action.icon)}
                <span className="ml-1">{action.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
