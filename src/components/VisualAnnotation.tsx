import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Eraser, Square, Circle, ArrowUp, Check, X, Download, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LedEffect } from '@/components/ui/led-effect';

interface VisualAnnotationProps {
  imageUrl: string;
  onClose: () => void;
  onSend: (annotatedImage: string, notes: string) => void;
}

type Tool = 'pencil' | 'eraser' | 'rectangle' | 'circle' | 'arrow' | 'text';
type DrawingObject = {
  type: Tool;
  points?: { x: number; y: number }[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  color: string;
  width: number;
  text?: string;
  textPosition?: { x: number; y: number };
};

export function VisualAnnotation({ imageUrl, onClose, onSend }: VisualAnnotationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>('pencil');
  const [currentColor, setCurrentColor] = useState('#FF5500');
  const [lineWidth, setLineWidth] = useState(3);
  const [objects, setObjects] = useState<DrawingObject[]>([]);
  const [currentObject, setCurrentObject] = useState<DrawingObject | null>(null);
  const [notes, setNotes] = useState('');
  const [image] = useState(new Image());
  
  // Inicializar o canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setContext(ctx);
    
    // Carregar a imagem
    image.onload = () => {
      // Ajustar o tamanho do canvas para a imagem
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Desenhar a imagem
      ctx.drawImage(image, 0, 0);
      
      // Redesenhar todos os objetos
      redrawCanvas(ctx);
    };
    
    image.src = imageUrl;
  }, [imageUrl]);
  
  // Redesenhar o canvas quando os objetos mudarem
  useEffect(() => {
    if (!context) return;
    redrawCanvas(context);
  }, [objects, context]);
  
  // Função para redesenhar o canvas
  const redrawCanvas = (ctx: CanvasRenderingContext2D) => {
    // Limpar o canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Desenhar a imagem
    ctx.drawImage(image, 0, 0);
    
    // Desenhar todos os objetos
    objects.forEach(obj => {
      drawObject(ctx, obj);
    });
    
    // Desenhar o objeto atual se estiver desenhando
    if (currentObject) {
      drawObject(ctx, currentObject);
    }
  };
  
  // Função para desenhar um objeto
  const drawObject = (ctx: CanvasRenderingContext2D, obj: DrawingObject) => {
    ctx.strokeStyle = obj.color;
    ctx.lineWidth = obj.width;
    ctx.fillStyle = obj.color;
    
    switch (obj.type) {
      case 'pencil':
        if (!obj.points || obj.points.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(obj.points[0].x, obj.points[0].y);
        
        for (let i = 1; i < obj.points.length; i++) {
          ctx.lineTo(obj.points[i].x, obj.points[i].y);
        }
        
        ctx.stroke();
        break;
        
      case 'eraser':
        // Similar ao lápis, mas com cor branca
        if (!obj.points || obj.points.length < 2) return;
        
        const originalColor = ctx.strokeStyle;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = obj.width * 2;
        
        ctx.beginPath();
        ctx.moveTo(obj.points[0].x, obj.points[0].y);
        
        for (let i = 1; i < obj.points.length; i++) {
          ctx.lineTo(obj.points[i].x, obj.points[i].y);
        }
        
        ctx.stroke();
        ctx.strokeStyle = originalColor;
        break;
        
      case 'rectangle':
        if (!obj.start || !obj.end) return;
        
        ctx.beginPath();
        ctx.rect(
          obj.start.x,
          obj.start.y,
          obj.end.x - obj.start.x,
          obj.end.y - obj.start.y
        );
        ctx.stroke();
        break;
        
      case 'circle':
        if (!obj.start || !obj.end) return;
        
        const radius = Math.sqrt(
          Math.pow(obj.end.x - obj.start.x, 2) +
          Math.pow(obj.end.y - obj.start.y, 2)
        );
        
        ctx.beginPath();
        ctx.arc(obj.start.x, obj.start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
        
      case 'arrow':
        if (!obj.start || !obj.end) return;
        
        // Desenhar a linha
        ctx.beginPath();
        ctx.moveTo(obj.start.x, obj.start.y);
        ctx.lineTo(obj.end.x, obj.end.y);
        ctx.stroke();
        
        // Desenhar a ponta da seta
        const angle = Math.atan2(obj.end.y - obj.start.y, obj.end.x - obj.start.x);
        const length = 15;
        
        ctx.beginPath();
        ctx.moveTo(obj.end.x, obj.end.y);
        ctx.lineTo(
          obj.end.x - length * Math.cos(angle - Math.PI / 6),
          obj.end.y - length * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(obj.end.x, obj.end.y);
        ctx.lineTo(
          obj.end.x - length * Math.cos(angle + Math.PI / 6),
          obj.end.y - length * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
        break;
        
      case 'text':
        if (!obj.textPosition || !obj.text) return;
        
        ctx.font = '16px Arial';
        ctx.fillText(obj.text, obj.textPosition.x, obj.textPosition.y);
        break;
    }
  };
  
  // Manipuladores de eventos do mouse
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    
    let newObject: DrawingObject;
    
    switch (currentTool) {
      case 'pencil':
      case 'eraser':
        newObject = {
          type: currentTool,
          points: [{ x, y }],
          color: currentTool === 'eraser' ? '#FFFFFF' : currentColor,
          width: lineWidth
        };
        break;
        
      case 'rectangle':
      case 'circle':
      case 'arrow':
        newObject = {
          type: currentTool,
          start: { x, y },
          end: { x, y },
          color: currentColor,
          width: lineWidth
        };
        break;
        
      case 'text':
        const text = prompt('Digite o texto:');
        if (!text) return;
        
        newObject = {
          type: 'text',
          textPosition: { x, y },
          text,
          color: currentColor,
          width: lineWidth
        };
        
        setObjects([...objects, newObject]);
        return;
        
      default:
        return;
    }
    
    setCurrentObject(newObject);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !currentObject) return;
    
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    switch (currentObject.type) {
      case 'pencil':
      case 'eraser':
        setCurrentObject({
          ...currentObject,
          points: [...(currentObject.points || []), { x, y }]
        });
        break;
        
      case 'rectangle':
      case 'circle':
      case 'arrow':
        setCurrentObject({
          ...currentObject,
          end: { x, y }
        });
        break;
    }
  };
  
  const handleMouseUp = () => {
    if (!isDrawing || !currentObject) return;
    
    setObjects([...objects, currentObject]);
    setCurrentObject(null);
    setIsDrawing(false);
  };
  
  // Função para limpar o canvas
  const clearCanvas = () => {
    setObjects([]);
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.drawImage(image, 0, 0);
    }
  };
  
  // Função para desfazer a última ação
  const undo = () => {
    if (objects.length === 0) return;
    
    const newObjects = [...objects];
    newObjects.pop();
    setObjects(newObjects);
  };
  
  // Função para baixar a imagem anotada
  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'annotated-image.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };
  
  // Função para enviar a imagem anotada
  const sendAnnotatedImage = () => {
    if (!canvasRef.current) return;
    
    const annotatedImage = canvasRef.current.toDataURL('image/png');
    onSend(annotatedImage, notes);
  };
  
  return (
    <div className="visual-annotation-container bg-black/90 fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
      <div className="visual-annotation-content bg-black/80 border border-orange-500/30 rounded-lg p-4 max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Anotação Visual</h2>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <div className="tools-panel w-12 bg-black/60 border-r border-orange-500/20 p-2 flex flex-col items-center space-y-3">
            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 ${currentTool === 'pencil' ? 'bg-orange-500/20 text-orange-300' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setCurrentTool('pencil')}
              title="Lápis"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 ${currentTool === 'eraser' ? 'bg-orange-500/20 text-orange-300' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setCurrentTool('eraser')}
              title="Borracha"
            >
              <Eraser className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 ${currentTool === 'rectangle' ? 'bg-orange-500/20 text-orange-300' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setCurrentTool('rectangle')}
              title="Retângulo"
            >
              <Square className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 ${currentTool === 'circle' ? 'bg-orange-500/20 text-orange-300' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setCurrentTool('circle')}
              title="Círculo"
            >
              <Circle className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 ${currentTool === 'arrow' ? 'bg-orange-500/20 text-orange-300' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setCurrentTool('arrow')}
              title="Seta"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 ${currentTool === 'text' ? 'bg-orange-500/20 text-orange-300' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setCurrentTool('text')}
              title="Texto"
            >
              <span className="font-bold text-xs">T</span>
            </Button>
            
            <div className="border-t border-gray-700 w-full my-2"></div>
            
            <div className="color-picker flex flex-col items-center space-y-2">
              {['#FF5500', '#00AAFF', '#00FF00', '#FFFF00', '#FFFFFF'].map(color => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full ${currentColor === color ? 'ring-2 ring-white' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                  title={`Cor: ${color}`}
                />
              ))}
            </div>
            
            <div className="border-t border-gray-700 w-full my-2"></div>
            
            <div className="line-width flex flex-col items-center space-y-2">
              {[2, 4, 6].map(width => (
                <button
                  key={width}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${lineWidth === width ? 'bg-orange-500/20' : 'bg-black/40'}`}
                  onClick={() => setLineWidth(width)}
                  title={`Espessura: ${width}`}
                >
                  <div
                    className="rounded-full bg-gray-300"
                    style={{ width: width, height: width }}
                  ></div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="canvas-container flex-1 overflow-auto relative">
            <LedEffect
              active={true}
              color="orange"
              intensity="low"
              pulse={false}
              className="p-2"
            >
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="bg-white"
                style={{ maxWidth: '100%', maxHeight: 'calc(90vh - 200px)' }}
              />
            </LedEffect>
          </div>
        </div>
        
        <div className="annotation-notes mt-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Adicione notas sobre suas anotações aqui..."
            className="w-full bg-black/60 border border-orange-500/30 text-gray-200 rounded-lg px-4 py-2 resize-none min-h-[80px] focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 placeholder-gray-500 text-sm"
          />
        </div>
        
        <div className="annotation-actions flex justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
              onClick={undo}
              title="Desfazer"
            >
              Desfazer
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
              onClick={clearCanvas}
              title="Limpar"
            >
              Limpar
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
              onClick={downloadImage}
              title="Baixar"
            >
              <Download className="h-4 w-4 mr-1" />
              Baixar
            </Button>
          </div>
          
          <Button
            className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
            onClick={sendAnnotatedImage}
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar para IA
          </Button>
        </div>
      </div>
    </div>
  );
}
