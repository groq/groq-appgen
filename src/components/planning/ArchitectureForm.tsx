import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface ArchitectureData {
  components?: string[];
  dataFlow?: string;
  diagram?: string;
}

interface ArchitectureFormProps {
  data: ArchitectureData;
  onUpdate: (data: ArchitectureData) => void;
}

export function ArchitectureForm({ data, onUpdate }: ArchitectureFormProps) {
  const [architecture, setArchitecture] = useState<ArchitectureData>(data || {
    components: [],
    dataFlow: '',
    diagram: ''
  });
  
  const [newComponent, setNewComponent] = useState('');
  
  // Atualizar o formulário quando os dados externos mudarem
  useEffect(() => {
    setArchitecture(data || {
      components: [],
      dataFlow: '',
      diagram: ''
    });
  }, [data]);
  
  // Atualizar os dados
  const handleChange = (field: keyof ArchitectureData, value: any) => {
    const updatedData = { ...architecture, [field]: value };
    setArchitecture(updatedData);
    onUpdate(updatedData);
  };
  
  // Adicionar um novo componente
  const addComponent = () => {
    if (!newComponent) return;
    
    const updatedComponents = [...(architecture.components || []), newComponent];
    handleChange('components', updatedComponents);
    setNewComponent('');
  };
  
  // Remover um componente
  const removeComponent = (index: number) => {
    const updatedComponents = (architecture.components || []).filter((_, i) => i !== index);
    handleChange('components', updatedComponents);
  };
  
  return (
    <div className="architecture-form space-y-4">
      <div className="text-xs text-gray-300 mb-2">
        Defina a arquitetura do seu projeto, incluindo os principais componentes e como eles se relacionam.
      </div>
      
      <div className="components-section">
        <h4 className="text-xs font-medium text-orange-300 mb-2">Componentes Principais</h4>
        
        <div className="space-y-2 mb-2">
          {(architecture.components || []).map((component, index) => (
            <div key={index} className="component-item flex items-center gap-2 bg-black/40 border border-gray-800 rounded-md p-2">
              <div className="flex-1 text-xs text-gray-200">{component}</div>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-gray-400 hover:text-red-400 hover:bg-transparent"
                onClick={() => removeComponent(index)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          
          {(architecture.components || []).length === 0 && (
            <div className="text-xs text-gray-500 italic">Nenhum componente definido</div>
          )}
        </div>
        
        <div className="add-component flex items-center gap-2 mb-4">
          <input
            type="text"
            value={newComponent}
            onChange={(e) => setNewComponent(e.target.value)}
            placeholder="Nome do componente"
            className="flex-1 bg-black/40 border border-gray-700 rounded text-xs p-2 text-gray-200"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addComponent();
              }
            }}
          />
          <Button
            size="sm"
            className="h-8 px-2 bg-black/40 border border-gray-700 hover:bg-gray-800 text-gray-300"
            onClick={addComponent}
          >
            <Plus className="h-3 w-3 mr-1" />
            Adicionar
          </Button>
        </div>
      </div>
      
      <div className="data-flow-section">
        <h4 className="text-xs font-medium text-orange-300 mb-2">Fluxo de Dados</h4>
        <Textarea
          value={architecture.dataFlow || ''}
          onChange={(e) => handleChange('dataFlow', e.target.value)}
          placeholder="Descreva como os dados fluem entre os componentes do sistema..."
          className="w-full bg-black/40 border-gray-700 text-gray-200 text-xs min-h-[100px]"
        />
      </div>
      
      <div className="diagram-section">
        <h4 className="text-xs font-medium text-orange-300 mb-2">Diagrama (opcional)</h4>
        <Textarea
          value={architecture.diagram || ''}
          onChange={(e) => handleChange('diagram', e.target.value)}
          placeholder="Descreva ou cole um link para um diagrama da arquitetura..."
          className="w-full bg-black/40 border-gray-700 text-gray-200 text-xs min-h-[60px]"
        />
        <p className="text-xs text-gray-500 mt-1">
          Dica: Você pode usar ferramentas como draw.io, Lucidchart ou Mermaid para criar diagramas.
        </p>
      </div>
    </div>
  );
}
