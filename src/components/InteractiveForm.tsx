import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface InteractiveFormProps {
  fields: FormField[];
  onSubmit?: (data: Record<string, any>) => void;
}

export function InteractiveForm({ fields, onSubmit }: InteractiveFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const handleChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };
  
  return (
    <form className="interactive-form space-y-3" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.id} className="form-field">
          <label className="block text-xs text-gray-300 mb-1">
            {field.label}
            {field.required && <span className="text-orange-400 ml-1">*</span>}
          </label>
          
          {field.type === 'text' && (
            <Input
              type="text"
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full bg-black/40 border-gray-700 text-gray-200 text-xs"
            />
          )}
          
          {field.type === 'textarea' && (
            <Textarea
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full bg-black/40 border-gray-700 text-gray-200 text-xs min-h-[80px]"
            />
          )}
          
          {field.type === 'select' && (
            <select
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              required={field.required}
              className="w-full bg-black/40 border border-gray-700 text-gray-200 text-xs rounded-md p-2 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30"
            >
              <option value="">Selecione uma opção</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          
          {field.type === 'number' && (
            <Input
              type="number"
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full bg-black/40 border-gray-700 text-gray-200 text-xs"
            />
          )}
        </div>
      ))}
      
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 text-xs py-1 h-auto"
        >
          <Send className="h-3 w-3 mr-1" />
          Enviar
        </Button>
      </div>
    </form>
  );
}
