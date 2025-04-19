import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface TechnologiesData {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  deployment?: string[];
}

interface TechnologiesFormProps {
  data: TechnologiesData;
  onUpdate: (data: TechnologiesData) => void;
}

// Sugestões de tecnologias populares
const TECHNOLOGY_SUGGESTIONS = {
  frontend: [
    'React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'Tailwind CSS', 
    'Material UI', 'Bootstrap', 'TypeScript', 'JavaScript'
  ],
  backend: [
    'Node.js', 'Express', 'NestJS', 'Django', 'Flask', 'FastAPI', 
    'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET Core'
  ],
  database: [
    'PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis', 'Firebase',
    'Supabase', 'DynamoDB', 'Cassandra', 'Elasticsearch'
  ],
  deployment: [
    'Vercel', 'Netlify', 'AWS', 'Google Cloud', 'Azure', 'Heroku',
    'Digital Ocean', 'Docker', 'Kubernetes', 'GitHub Actions'
  ]
};

export function TechnologiesForm({ data, onUpdate }: TechnologiesFormProps) {
  const [technologies, setTechnologies] = useState<TechnologiesData>(data || {
    frontend: [],
    backend: [],
    database: [],
    deployment: []
  });
  
  const [newTech, setNewTech] = useState<Record<string, string>>({
    frontend: '',
    backend: '',
    database: '',
    deployment: ''
  });
  
  // Atualizar o formulário quando os dados externos mudarem
  useEffect(() => {
    setTechnologies(data || {
      frontend: [],
      backend: [],
      database: [],
      deployment: []
    });
  }, [data]);
  
  // Adicionar uma nova tecnologia
  const addTechnology = (category: keyof TechnologiesData) => {
    if (!newTech[category]) return;
    
    const updatedTechnologies = { 
      ...technologies,
      [category]: [...(technologies[category] || []), newTech[category]]
    };
    
    setTechnologies(updatedTechnologies);
    setNewTech({ ...newTech, [category]: '' });
    onUpdate(updatedTechnologies);
  };
  
  // Adicionar uma tecnologia sugerida
  const addSuggestion = (category: keyof TechnologiesData, tech: string) => {
    if ((technologies[category] || []).includes(tech)) return;
    
    const updatedTechnologies = { 
      ...technologies,
      [category]: [...(technologies[category] || []), tech]
    };
    
    setTechnologies(updatedTechnologies);
    onUpdate(updatedTechnologies);
  };
  
  // Remover uma tecnologia
  const removeTechnology = (category: keyof TechnologiesData, tech: string) => {
    const updatedTechnologies = { 
      ...technologies,
      [category]: (technologies[category] || []).filter(t => t !== tech)
    };
    
    setTechnologies(updatedTechnologies);
    onUpdate(updatedTechnologies);
  };
  
  // Renderizar uma seção de tecnologia
  const renderTechnologySection = (
    title: string, 
    category: keyof TechnologiesData,
    suggestions: string[]
  ) => (
    <div className="technology-section mb-4">
      <h4 className="text-xs font-medium text-orange-300 mb-2">{title}</h4>
      
      <div className="selected-technologies flex flex-wrap gap-1 mb-2">
        {(technologies[category] || []).map((tech) => (
          <div 
            key={tech} 
            className="tech-tag bg-orange-500/10 border border-orange-500/30 rounded-full px-2 py-0.5 text-xs text-gray-300 flex items-center"
          >
            {tech}
            <button 
              className="ml-1 text-gray-400 hover:text-orange-300"
              onClick={() => removeTechnology(category, tech)}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        {(technologies[category] || []).length === 0 && (
          <div className="text-xs text-gray-500 italic">Nenhuma tecnologia selecionada</div>
        )}
      </div>
      
      <div className="add-technology flex items-center gap-2 mb-2">
        <input
          type="text"
          value={newTech[category]}
          onChange={(e) => setNewTech({ ...newTech, [category]: e.target.value })}
          placeholder={`Adicionar ${title.toLowerCase()}`}
          className="flex-1 bg-black/40 border border-gray-700 rounded text-xs p-1 text-gray-200"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTechnology(category);
            }
          }}
        />
        <Button
          size="sm"
          className="h-6 w-6 p-0 bg-black/40 border border-gray-700 hover:bg-gray-800 text-gray-300"
          onClick={() => addTechnology(category)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="suggestions">
        <div className="text-xs text-gray-400 mb-1">Sugestões:</div>
        <div className="flex flex-wrap gap-1">
          {suggestions.map((tech) => (
            <button
              key={tech}
              className={`text-xs px-2 py-0.5 rounded-full border ${
                (technologies[category] || []).includes(tech)
                  ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                  : 'bg-black/40 border-gray-700 text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
              onClick={() => addSuggestion(category, tech)}
              disabled={(technologies[category] || []).includes(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="technologies-form">
      <div className="text-xs text-gray-300 mb-3">
        Selecione as tecnologias que deseja utilizar no seu projeto. Você pode escolher entre as sugestões ou adicionar suas próprias tecnologias.
      </div>
      
      {renderTechnologySection('Frontend', 'frontend', TECHNOLOGY_SUGGESTIONS.frontend)}
      {renderTechnologySection('Backend', 'backend', TECHNOLOGY_SUGGESTIONS.backend)}
      {renderTechnologySection('Banco de Dados', 'database', TECHNOLOGY_SUGGESTIONS.database)}
      {renderTechnologySection('Deployment', 'deployment', TECHNOLOGY_SUGGESTIONS.deployment)}
    </div>
  );
}
