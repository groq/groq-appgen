import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LedEffect } from '@/components/ui/led-effect';

interface ElementSelectorProps {
  onClose: () => void;
  onSendFeedback: (elementPath: string, feedback: string) => void;
}

export function ElementSelectorNew({ onClose, onSendFeedback }: ElementSelectorProps) {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [elementPath, setElementPath] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isSelecting, setIsSelecting] = useState<boolean>(true);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Iniciar o modo de seleção
  useEffect(() => {
    if (!isSelecting) return;
    
    const handleMouseOver = (e: MouseEvent) => {
      e.stopPropagation();
      
      // Ignorar elementos do próprio seletor
      if (overlayRef.current?.contains(e.target as Node)) return;
      
      const target = e.target as HTMLElement;
      setHighlightedElement(target);
    };
    
    const handleMouseOut = () => {
      setHighlightedElement(null);
    };
    
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Ignorar elementos do próprio seletor
      if (overlayRef.current?.contains(e.target as Node)) return;
      
      const target = e.target as HTMLElement;
      setSelectedElement(target);
      setElementPath(getElementPath(target));
      setIsSelecting(false);
    };
    
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);
    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mouseout', handleMouseOut, true);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isSelecting]);
  
  // Destacar o elemento selecionado
  useEffect(() => {
    if (!highlightedElement) return;
    
    const originalOutline = highlightedElement.style.outline;
    const originalPosition = highlightedElement.style.position;
    const originalZIndex = highlightedElement.style.zIndex;
    
    highlightedElement.style.outline = '2px solid #FF5500';
    highlightedElement.style.position = 'relative';
    highlightedElement.style.zIndex = '9999';
    
    return () => {
      if (highlightedElement) {
        highlightedElement.style.outline = originalOutline;
        highlightedElement.style.position = originalPosition;
        highlightedElement.style.zIndex = originalZIndex;
      }
    };
  }, [highlightedElement]);
  
  // Obter o caminho do elemento
  const getElementPath = (element: HTMLElement): string => {
    let path = '';
    let current: HTMLElement | null = element;
    
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
      } else if (current.className && typeof current.className === 'string') {
        // Filtrar classes vazias e classes de utilidade do Tailwind
        const filteredClasses = current.className.split(' ')
          .filter(cls => cls.trim() !== '')
          .filter(cls => !cls.startsWith('hover:') && !cls.startsWith('focus:') && !cls.startsWith('active:'))
          .join('.');
        
        if (filteredClasses) {
          selector += `.${filteredClasses}`;
        }
      }
      
      // Adicionar atributos data-* se existirem
      Array.from(current.attributes)
        .filter(attr => attr.name.startsWith('data-'))
        .forEach(attr => {
          selector += `[${attr.name}="${attr.value}"]`;
        });
      
      path = path ? `${selector} > ${path}` : selector;
      current = current.parentElement;
    }
    
    return path;
  };
  
  // Reiniciar a seleção
  const resetSelection = () => {
    setSelectedElement(null);
    setElementPath('');
    setFeedback('');
    setIsSelecting(true);
  };
  
  // Enviar feedback
  const handleSendFeedback = () => {
    if (!elementPath || !feedback.trim()) return;
    
    onSendFeedback(elementPath, feedback);
    onClose();
  };
  
  return (
    <div 
      ref={overlayRef}
      className="element-selector-overlay fixed inset-0 z-50 pointer-events-none"
    >
      <div className="element-selector-controls fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 border border-orange-500/30 rounded-lg p-4 max-w-xl w-full pointer-events-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-medium">
            {isSelecting ? 'Selecione um elemento na página' : 'Elemento selecionado'}
          </h3>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {!isSelecting && (
          <>
            <LedEffect
              active={true}
              color="orange"
              intensity="low"
              pulse={false}
              className="mb-4"
            >
              <div className="element-path bg-black/60 border border-orange-500/20 rounded-lg p-2 text-xs text-gray-300 font-mono overflow-x-auto">
                {elementPath}
              </div>
            </LedEffect>
            
            <div className="element-feedback mb-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Descreva as alterações que você deseja fazer neste elemento..."
                className="w-full bg-black/60 border border-orange-500/30 text-gray-200 rounded-lg px-4 py-2 resize-none min-h-[80px] focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 placeholder-gray-500 text-sm"
              />
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
                onClick={resetSelection}
              >
                Selecionar outro elemento
              </Button>
              
              <Button
                className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
                onClick={handleSendFeedback}
                disabled={!feedback.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          </>
        )}
        
        {isSelecting && (
          <p className="text-gray-300 text-sm">
            Passe o mouse sobre os elementos da página e clique para selecionar o elemento que deseja modificar.
          </p>
        )}
      </div>
    </div>
  );
}
