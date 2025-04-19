import React, { useState } from 'react';
import { ElementSelector } from '@/components/ElementSelector';
import { Button } from '@/components/ui/button';

export default function ElementSelectorTest() {
  const [isElementSelectorActive, setIsElementSelectorActive] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const handleActivateElementSelector = () => {
    setIsElementSelectorActive(true);
    setLogs(prev => [...prev, 'Seletor de elementos ativado']);
  };
  
  const handleCloseElementSelector = () => {
    setIsElementSelectorActive(false);
    setLogs(prev => [...prev, 'Seletor de elementos fechado']);
  };
  
  const handleSendFeedback = (elementPath: string, feedbackText: string) => {
    setSelectedElement(elementPath);
    setFeedback(feedbackText);
    setIsElementSelectorActive(false);
    setLogs(prev => [...prev, `Feedback enviado para elemento: ${elementPath}`]);
    setLogs(prev => [...prev, `Conteúdo do feedback: ${feedbackText}`]);
  };
  
  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-8">Teste do ElementSelector</h1>
      
      <div className="flex justify-center mb-8">
        <Button
          onClick={handleActivateElementSelector}
          className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
        >
          Ativar Seletor de Elementos
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-black/80 border border-orange-500/30 rounded-lg p-4">
          <h2 className="text-lg font-bold text-white mb-4">Exemplo de Interface</h2>
          
          <div className="demo-interface bg-gray-800 rounded-lg p-4">
            <header className="bg-gray-700 p-4 rounded-lg mb-4">
              <h3 className="text-white font-bold">Cabeçalho da Aplicação</h3>
              <nav className="mt-2">
                <ul className="flex space-x-4">
                  <li className="text-orange-300 hover:text-orange-200 cursor-pointer">Início</li>
                  <li className="text-orange-300 hover:text-orange-200 cursor-pointer">Produtos</li>
                  <li className="text-orange-300 hover:text-orange-200 cursor-pointer">Sobre</li>
                  <li className="text-orange-300 hover:text-orange-200 cursor-pointer">Contato</li>
                </ul>
              </nav>
            </header>
            
            <main className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-white font-bold mb-2">Card 1</h4>
                <p className="text-gray-300 text-sm">Descrição do card 1 com algumas informações importantes.</p>
                <button className="mt-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 rounded px-2 py-1 text-xs">
                  Ação 1
                </button>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-white font-bold mb-2">Card 2</h4>
                <p className="text-gray-300 text-sm">Descrição do card 2 com algumas informações importantes.</p>
                <button className="mt-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 rounded px-2 py-1 text-xs">
                  Ação 2
                </button>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-white font-bold mb-2">Card 3</h4>
                <p className="text-gray-300 text-sm">Descrição do card 3 com algumas informações importantes.</p>
                <button className="mt-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 rounded px-2 py-1 text-xs">
                  Ação 3
                </button>
              </div>
            </main>
            
            <footer className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300 text-sm text-center">© 2023 Exemplo de Interface. Todos os direitos reservados.</p>
            </footer>
          </div>
        </div>
        
        <div className="bg-black/80 border border-orange-500/30 rounded-lg p-4">
          <h2 className="text-lg font-bold text-white mb-4">Resultado da Seleção</h2>
          
          {selectedElement ? (
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white mb-2">Elemento Selecionado:</h3>
                <div className="p-3 bg-gray-800 rounded border border-gray-700 font-mono text-xs text-orange-300 overflow-x-auto">
                  {selectedElement}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Feedback:</h3>
                <div className="p-3 bg-gray-800 rounded border border-gray-700 text-gray-300 text-sm">
                  {feedback}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-gray-500">Nenhum elemento selecionado</p>
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
      
      {isElementSelectorActive && (
        <ElementSelector
          onClose={handleCloseElementSelector}
          onSendFeedback={handleSendFeedback}
        />
      )}
    </div>
  );
}
