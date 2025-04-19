"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';

interface ElementSelectorProps {
  onCapture: (imageData: string, comment: string, element: Element) => void;
  onCancel: () => void;
}

export default function ElementSelector({ onCapture, onCancel }: ElementSelectorProps) {
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const commentBoxRef = useRef<HTMLDivElement>(null);

  // Inicializar o seletor de elementos
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      // Ignorar elementos do próprio seletor
      if (
        e.target instanceof Element && 
        !e.target.closest('.element-selector-ui') &&
        e.target !== document.body &&
        !(e.target instanceof HTMLHtmlElement)
      ) {
        setHoveredElement(e.target);
        
        // Prevenir comportamentos padrão enquanto seleciona
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (hoveredElement && !showCommentBox) {
        setSelectedElement(hoveredElement);
        setShowCommentBox(true);
        
        // Prevenir comportamentos padrão
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    // Adicionar event listeners
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown);

    // Remover event listeners ao desmontar
    return () => {
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [hoveredElement, showCommentBox, onCancel]);

  // Capturar o elemento selecionado
  const captureSelectedElement = async () => {
    if (!selectedElement) return;

    try {
      // Destacar o elemento selecionado
      const originalOutline = selectedElement.style.outline;
      const originalOutlineOffset = selectedElement.style.outlineOffset;
      
      selectedElement.style.outline = '2px solid rgba(255, 165, 0, 0.5)';
      selectedElement.style.outlineOffset = '2px';
      
      // Capturar a tela
      const canvas = await html2canvas(document.body);
      
      // Restaurar o estilo original
      selectedElement.style.outline = originalOutline;
      selectedElement.style.outlineOffset = originalOutlineOffset;
      
      // Obter as coordenadas do elemento
      const rect = selectedElement.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      
      // Criar um novo canvas para o elemento
      const elementCanvas = document.createElement('canvas');
      elementCanvas.width = rect.width;
      elementCanvas.height = rect.height;
      const ctx = elementCanvas.getContext('2d');
      
      if (ctx) {
        // Recortar o elemento
        ctx.drawImage(
          canvas, 
          rect.left + scrollX, rect.top + scrollY, rect.width, rect.height, 
          0, 0, rect.width, rect.height
        );
        
        // Converter para base64
        const imageData = elementCanvas.toDataURL('image/png');
        
        // Enviar para o callback
        onCapture(imageData, comment, selectedElement);
      }
    } catch (error) {
      console.error('Erro ao capturar elemento:', error);
      onCancel();
    }
  };

  // Calcular o estilo do highlight do elemento
  const getHighlightStyle = () => {
    if (!hoveredElement && !selectedElement) return {};
    
    const element = selectedElement || hoveredElement;
    if (!element) return {};
    
    const rect = element.getBoundingClientRect();
    
    return {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    };
  };

  // Calcular a posição da caixa de comentário
  const getCommentBoxPosition = () => {
    if (!selectedElement || !commentBoxRef.current) return {};
    
    const elementRect = selectedElement.getBoundingClientRect();
    const commentBoxRect = commentBoxRef.current.getBoundingClientRect();
    
    // Tentar posicionar abaixo do elemento
    let top = elementRect.bottom + 10;
    let left = elementRect.left;
    
    // Se não couber abaixo, tentar posicionar acima
    if (top + commentBoxRect.height > window.innerHeight) {
      top = elementRect.top - commentBoxRect.height - 10;
    }
    
    // Ajustar horizontalmente se necessário
    if (left + commentBoxRect.width > window.innerWidth) {
      left = window.innerWidth - commentBoxRect.width - 10;
    }
    
    return {
      top: `${top}px`,
      left: `${left}px`,
    };
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Overlay transparente */}
      <div className="absolute inset-0 bg-black/30 pointer-events-auto" />
      
      {/* Highlight do elemento */}
      {(hoveredElement || selectedElement) && (
        <div 
          className={`absolute border-2 ${selectedElement ? 'border-orange-500 bg-orange-500/10' : 'border-blue-500 bg-blue-500/10'}`}
          style={getHighlightStyle()}
        />
      )}
      
      {/* Caixa de comentário */}
      {showCommentBox && (
        <div 
          ref={commentBoxRef}
          className="element-selector-ui absolute z-50 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 w-80 pointer-events-auto"
          style={getCommentBoxPosition()}
        >
          <h3 className="text-sm font-medium text-gray-300 mb-2">Adicionar comentário (opcional)</h3>
          <textarea
            className="w-full h-24 p-2 mb-3 text-sm bg-black/50 border border-gray-700 rounded text-white"
            placeholder="Descreva o problema ou sugestão..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button 
              variant="default" 
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={captureSelectedElement}
            >
              Enviar
            </Button>
          </div>
        </div>
      )}
      
      {/* Instruções */}
      {!showCommentBox && (
        <div className="element-selector-ui fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm pointer-events-auto">
          Passe o mouse sobre um elemento e clique para selecioná-lo. Pressione ESC para cancelar.
        </div>
      )}
    </div>
  );
}
