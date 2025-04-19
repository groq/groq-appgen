import React, { useState, useEffect } from 'react';
import { VisualAnnotation } from '@/components/VisualAnnotation';
import { Button } from '@/components/ui/button';

export default function VisualAnnotationTest() {
  const [isAnnotationActive, setIsAnnotationActive] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [annotatedImage, setAnnotatedImage] = useState('');
  const [notes, setNotes] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  
  // Gerar uma imagem de exemplo
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Fundo
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, 800, 600);
      
      // Cabeçalho
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, 800, 80);
      
      // Logo
      ctx.fillStyle = '#ff5500';
      ctx.fillRect(20, 20, 40, 40);
      
      // Título
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Exemplo de Interface', 80, 45);
      
      // Menu
      ctx.fillStyle = '#444';
      ctx.fillRect(0, 80, 200, 520);
      
      // Itens do menu
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.fillText('Dashboard', 20, 120);
      ctx.fillText('Usuários', 20, 160);
      ctx.fillText('Configurações', 20, 200);
      
      // Conteúdo
      ctx.fillStyle = '#222';
      ctx.fillRect(220, 100, 560, 480);
      
      // Cards
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#333';
        ctx.fillRect(240 + i * 190, 120, 170, 120);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Card ${i + 1}`, 260 + i * 190, 150);
        
        ctx.fillStyle = '#aaa';
        ctx.font = '14px Arial';
        ctx.fillText('Descrição do card', 260 + i * 190, 180);
      }
      
      // Tabela
      ctx.fillStyle = '#333';
      ctx.fillRect(240, 260, 520, 300);
      
      // Cabeçalho da tabela
      ctx.fillStyle = '#444';
      ctx.fillRect(240, 260, 520, 40);
      
      // Colunas da tabela
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('ID', 260, 285);
      ctx.fillText('Nome', 360, 285);
      ctx.fillText('Email', 460, 285);
      ctx.fillText('Ações', 660, 285);
      
      // Linhas da tabela
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#2a2a2a' : '#333';
        ctx.fillRect(240, 300 + i * 50, 520, 50);
        
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.fillText(`${i + 1}`, 260, 330 + i * 50);
        ctx.fillText(`Usuário ${i + 1}`, 360, 330 + i * 50);
        ctx.fillText(`usuario${i + 1}@exemplo.com`, 460, 330 + i * 50);
        
        // Botões de ação
        ctx.fillStyle = '#ff5500';
        ctx.fillRect(660, 315 + i * 50, 30, 20);
        ctx.fillStyle = '#3498db';
        ctx.fillRect(700, 315 + i * 50, 30, 20);
      }
      
      setImageUrl(canvas.toDataURL('image/png'));
    }
  }, []);
  
  const handleActivateAnnotation = () => {
    setIsAnnotationActive(true);
    setLogs(prev => [...prev, 'Anotação ativada']);
  };
  
  const handleCloseAnnotation = () => {
    setIsAnnotationActive(false);
    setLogs(prev => [...prev, 'Anotação fechada']);
  };
  
  const handleSendAnnotation = (annotatedImg: string, annotationNotes: string) => {
    setAnnotatedImage(annotatedImg);
    setNotes(annotationNotes);
    setIsAnnotationActive(false);
    setLogs(prev => [...prev, `Anotação enviada com notas: ${annotationNotes || 'Nenhuma'}`]);
  };
  
  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-8">Teste do VisualAnnotation</h1>
      
      <div className="flex justify-center mb-8">
        <Button
          onClick={handleActivateAnnotation}
          className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
        >
          Ativar Anotação Visual
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-black/80 border border-orange-500/30 rounded-lg p-4">
          <h2 className="text-lg font-bold text-white mb-4">Imagem Original</h2>
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt="Imagem original" 
              className="w-full border border-gray-700 rounded"
            />
          )}
        </div>
        
        <div className="bg-black/80 border border-orange-500/30 rounded-lg p-4">
          <h2 className="text-lg font-bold text-white mb-4">Imagem Anotada</h2>
          {annotatedImage ? (
            <img 
              src={annotatedImage} 
              alt="Imagem anotada" 
              className="w-full border border-gray-700 rounded"
            />
          ) : (
            <div className="w-full h-[300px] flex items-center justify-center border border-gray-700 rounded">
              <p className="text-gray-500">Nenhuma anotação feita</p>
            </div>
          )}
          
          {notes && (
            <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-700">
              <h3 className="text-sm font-bold text-white mb-2">Notas:</h3>
              <p className="text-gray-300 text-sm">{notes}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-black/80 border border-orange-500/30 rounded-lg p-4 mt-8">
        <h2 className="text-lg font-bold text-white mb-4">Logs</h2>
        <div className="text-gray-300 font-mono text-sm">
          {logs.length === 0 ? (
            <p className="text-gray-500">Nenhuma ação registrada</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="py-1 border-b border-gray-800">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
      
      {isAnnotationActive && (
        <VisualAnnotation
          imageUrl={imageUrl}
          onClose={handleCloseAnnotation}
          onSend={handleSendAnnotation}
        />
      )}
    </div>
  );
}
