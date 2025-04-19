"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';

interface AreaSelectorProps {
  onCapture: (imageData: string, comment: string) => void;
  onCancel: () => void;
}

export default function AreaSelector({ onCapture, onCancel }: AreaSelectorProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const selectionRef = useRef<HTMLDivElement>(null);
  const commentBoxRef = useRef<HTMLDivElement>(null);

  // Iniciar a seleção
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isSelecting) {
      setIsSelecting(true);
      setStartPos({ x: e.clientX, y: e.clientY });
      setEndPos({ x: e.clientX, y: e.clientY });
    }
  };

  // Atualizar a seleção enquanto arrasta
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSelecting) {
      setEndPos({ x: e.clientX, y: e.clientY });
    }
  };

  // Finalizar a seleção
  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
      
      // Se a área selecionada for muito pequena, cancelar
      const width = Math.abs(endPos.x - startPos.x);
      const height = Math.abs(endPos.y - startPos.y);
      
      if (width < 10 || height < 10) {
        onCancel();
        return;
      }
      
      setShowCommentBox(true);
    }
  };

  // Capturar a área selecionada
  const captureSelectedArea = async () => {
    try {
      // Calcular as coordenadas da área selecionada
      const left = Math.min(startPos.x, endPos.x);
      const top = Math.min(startPos.y, endPos.y);
      const width = Math.abs(endPos.x - startPos.x);
      const height = Math.abs(endPos.y - startPos.y);
      
      // Capturar a tela inteira
      const canvas = await html2canvas(document.body);
      
      // Criar um novo canvas para a área selecionada
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      const ctx = croppedCanvas.getContext('2d');
      
      if (ctx) {
        // Recortar a área selecionada
        ctx.drawImage(
          canvas, 
          left, top, width, height, 
          0, 0, width, height
        );
        
        // Converter para base64
        const imageData = croppedCanvas.toDataURL('image/png');
        
        // Enviar para o callback
        onCapture(imageData, comment);
      }
    } catch (error) {
      console.error('Erro ao capturar área:', error);
      onCancel();
    }
  };

  // Calcular o estilo da área de seleção
  const getSelectionStyle = () => {
    const left = Math.min(startPos.x, endPos.x);
    const top = Math.min(startPos.y, endPos.y);
    const width = Math.abs(endPos.x - startPos.x);
    const height = Math.abs(endPos.y - startPos.y);
    
    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
  };

  // Calcular a posição da caixa de comentário
  const getCommentBoxPosition = () => {
    if (!selectionRef.current || !commentBoxRef.current) return {};
    
    const selectionRect = selectionRef.current.getBoundingClientRect();
    const commentBoxRect = commentBoxRef.current.getBoundingClientRect();
    
    // Tentar posicionar abaixo da seleção
    let top = selectionRect.bottom + 10;
    let left = selectionRect.left;
    
    // Se não couber abaixo, tentar posicionar acima
    if (top + commentBoxRect.height > window.innerHeight) {
      top = selectionRect.top - commentBoxRect.height - 10;
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

  // Lidar com teclas de atalho (Esc para cancelar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div 
      className="fixed inset-0 z-50 cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Área de seleção */}
      {(isSelecting || showCommentBox) && (
        <div 
          ref={selectionRef}
          className="absolute border-2 border-orange-500 bg-orange-500/10"
          style={getSelectionStyle()}
        />
      )}
      
      {/* Caixa de comentário */}
      {showCommentBox && (
        <div 
          ref={commentBoxRef}
          className="absolute z-50 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 w-80"
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
              onClick={captureSelectedArea}
            >
              Enviar
            </Button>
          </div>
        </div>
      )}
      
      {/* Instruções */}
      {!showCommentBox && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
          Selecione uma área da tela arrastando o mouse. Pressione ESC para cancelar.
        </div>
      )}
    </div>
  );
}
