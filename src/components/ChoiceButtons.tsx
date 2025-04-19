import React from 'react';
import { Button } from '@/components/ui/button';

export interface Choice {
  id: string;
  label: string;
  icon?: React.ReactNode;
  type?: 'default' | 'primary' | 'secondary' | 'danger' | 'success';
  description?: string;
}

interface ChoiceButtonsProps {
  choices: Choice[];
  onSelect?: (choice: Choice) => void;
}

export function ChoiceButtons({ choices, onSelect }: ChoiceButtonsProps) {
  const getButtonClass = (type: string = 'default') => {
    switch (type) {
      case 'primary':
        return 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30';
      case 'secondary':
        return 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30';
      case 'danger':
        return 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30';
      case 'success':
        return 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30';
      default:
        return 'bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 border border-gray-700';
    }
  };
  
  return (
    <div className="choice-buttons space-y-2">
      {choices.map((choice) => (
        <div key={choice.id} className="choice-button-container">
          <Button
            className={`w-full justify-start text-xs py-2 h-auto ${getButtonClass(choice.type)}`}
            onClick={() => onSelect && onSelect(choice)}
          >
            {choice.icon && <span className="choice-icon mr-2">{choice.icon}</span>}
            <span className="choice-label">{choice.label}</span>
          </Button>
          
          {choice.description && (
            <p className="text-xs text-gray-400 mt-1 ml-2">{choice.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
