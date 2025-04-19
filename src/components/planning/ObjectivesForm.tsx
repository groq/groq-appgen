import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ObjectivesData {
  title?: string;
  description?: string;
  targetAudience?: string;
}

interface ObjectivesFormProps {
  data: ObjectivesData;
  onUpdate: (data: ObjectivesData) => void;
}

export function ObjectivesForm({ data, onUpdate }: ObjectivesFormProps) {
  const [formData, setFormData] = useState<ObjectivesData>(data || {});
  
  // Atualizar o formulário quando os dados externos mudarem
  useEffect(() => {
    setFormData(data || {});
  }, [data]);
  
  // Atualizar os dados quando o formulário mudar
  const handleChange = (field: keyof ObjectivesData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };
  
  return (
    <div className="objectives-form space-y-4">
      <div className="form-field">
        <label className="block text-xs text-gray-300 mb-1">
          Título do Projeto <span className="text-orange-400">*</span>
        </label>
        <Input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Ex: Sistema de Gerenciamento de Tarefas"
          className="w-full bg-black/40 border-gray-700 text-gray-200 text-xs"
        />
      </div>
      
      <div className="form-field">
        <label className="block text-xs text-gray-300 mb-1">
          Descrição <span className="text-orange-400">*</span>
        </label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Descreva o propósito e os objetivos principais do projeto..."
          className="w-full bg-black/40 border-gray-700 text-gray-200 text-xs min-h-[100px]"
        />
      </div>
      
      <div className="form-field">
        <label className="block text-xs text-gray-300 mb-1">
          Público-Alvo
        </label>
        <Textarea
          value={formData.targetAudience || ''}
          onChange={(e) => handleChange('targetAudience', e.target.value)}
          placeholder="Descreva quem são os usuários principais do sistema..."
          className="w-full bg-black/40 border-gray-700 text-gray-200 text-xs min-h-[80px]"
        />
      </div>
    </div>
  );
}
