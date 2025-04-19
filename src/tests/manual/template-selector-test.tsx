import React, { useState } from 'react';
import { TemplateSelector } from '@/components/TemplateSelector';
import { Button } from '@/components/ui/button';
import { ProjectTemplate } from '@/utils/project-templates';

export default function TemplateSelectorTest() {
  const [isTemplateSelectorActive, setIsTemplateSelectorActive] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const handleActivateTemplateSelector = () => {
    setIsTemplateSelectorActive(true);
    setLogs(prev => [...prev, 'Seletor de templates ativado']);
  };
  
  const handleCloseTemplateSelector = () => {
    setIsTemplateSelectorActive(false);
    setLogs(prev => [...prev, 'Seletor de templates fechado']);
  };
  
  const handleSelectTemplate = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
    setIsTemplateSelectorActive(false);
    setLogs(prev => [...prev, `Template selecionado: ${template.name}`]);
  };
  
  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-8">Teste do TemplateSelector</h1>
      
      <div className="flex justify-center mb-8">
        <Button
          onClick={handleActivateTemplateSelector}
          className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
        >
          Ativar Seletor de Templates
        </Button>
      </div>
      
      <div className="bg-black/80 border border-orange-500/30 rounded-lg p-4 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Template Selecionado</h2>
        
        {selectedTemplate ? (
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white mb-2">Nome:</h3>
              <div className="p-3 bg-gray-800 rounded border border-gray-700 text-orange-300">
                {selectedTemplate.name}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white mb-2">Descrição:</h3>
              <div className="p-3 bg-gray-800 rounded border border-gray-700 text-gray-300">
                {selectedTemplate.description}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white mb-2">Categoria:</h3>
              <div className="p-3 bg-gray-800 rounded border border-gray-700 text-gray-300">
                {selectedTemplate.category}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white mb-2">Tecnologias:</h3>
              <div className="p-3 bg-gray-800 rounded border border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-orange-500/10 text-orange-300 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white mb-2">Arquivos ({selectedTemplate.files.length}):</h3>
              <div className="p-3 bg-gray-800 rounded border border-gray-700 max-h-[200px] overflow-y-auto">
                <ul className="text-gray-300 text-sm">
                  {selectedTemplate.files.map((file, index) => (
                    <li key={index} className="py-1 border-b border-gray-700">
                      {file.path}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white mb-2">Comandos de Configuração:</h3>
              <div className="p-3 bg-gray-800 rounded border border-gray-700 font-mono text-xs text-gray-300">
                {selectedTemplate.setupCommands.map((cmd, index) => (
                  <div key={index} className="py-1">
                    $ {cmd}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Comando de Inicialização:</h3>
              <div className="p-3 bg-gray-800 rounded border border-gray-700 font-mono text-xs text-orange-300">
                $ {selectedTemplate.startCommand}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-gray-500">Nenhum template selecionado</p>
          </div>
        )}
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
      
      {isTemplateSelectorActive && (
        <TemplateSelector
          onSelectTemplate={handleSelectTemplate}
          onClose={handleCloseTemplateSelector}
        />
      )}
    </div>
  );
}
