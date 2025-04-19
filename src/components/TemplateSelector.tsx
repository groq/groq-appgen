import React, { useState } from 'react';
import { ProjectTemplate, getAllTemplates, getTemplatesByCategory, getTemplatesByTechnology } from '@/utils/project-templates';
import { LedEffect } from '@/components/ui/led-effect';
import { Search, Filter, Code, Server, Layers, Smartphone, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplateSelectorProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
  onClose: () => void;
}

export function TemplateSelector({ onSelectTemplate, onClose }: TemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [templates, setTemplates] = useState<ProjectTemplate[]>(getAllTemplates());

  // Filtrar templates com base na pesquisa e categoria
  const filterTemplates = () => {
    let filteredTemplates = getAllTemplates();

    // Filtrar por categoria
    if (selectedCategory) {
      filteredTemplates = getTemplatesByCategory(selectedCategory);
    }

    // Filtrar por termo de pesquisa
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filteredTemplates = filteredTemplates.filter(template =>
        template.name.toLowerCase().includes(term) ||
        template.description.toLowerCase().includes(term) ||
        template.technologies.some(tech => tech.toLowerCase().includes(term))
      );
    }

    setTemplates(filteredTemplates);
  };

  // Manipular mudança na pesquisa
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Manipular submissão da pesquisa
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filterTemplates();
  };

  // Manipular seleção de categoria
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setTemplates(category ? getTemplatesByCategory(category) : getAllTemplates());
  };

  // Obter ícone para categoria
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frontend':
        return <Code className="h-4 w-4" />;
      case 'backend':
        return <Server className="h-4 w-4" />;
      case 'fullstack':
        return <Layers className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="template-selector-overlay fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <LedEffect
        active={true}
        color="orange"
        intensity="low"
        pulse={false}
        className="w-full max-w-4xl"
      >
        <div className="template-selector-content bg-black/80 border border-orange-500/30 rounded-lg p-6 w-full max-h-[90vh] flex flex-col">
        <div className="template-selector-header flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Selecionar Template</h2>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </div>

        <div className="template-selector-search mb-6">
          <form onSubmit={handleSearchSubmit} className="flex">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Pesquisar templates..."
                className="w-full bg-black/60 border border-orange-500/30 text-gray-200 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 placeholder-gray-500 text-sm"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <Button
              type="submit"
              className="ml-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
            >
              Buscar
            </Button>
          </form>
        </div>

        <div className="template-selector-categories mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            className={selectedCategory === null ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'text-gray-400 border-gray-700'}
            onClick={() => handleCategorySelect(null)}
          >
            Todos
          </Button>

          <Button
            variant={selectedCategory === 'frontend' ? 'default' : 'outline'}
            size="sm"
            className={selectedCategory === 'frontend' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'text-gray-400 border-gray-700'}
            onClick={() => handleCategorySelect('frontend')}
          >
            <Code className="h-4 w-4 mr-1" />
            Frontend
          </Button>

          <Button
            variant={selectedCategory === 'backend' ? 'default' : 'outline'}
            size="sm"
            className={selectedCategory === 'backend' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'text-gray-400 border-gray-700'}
            onClick={() => handleCategorySelect('backend')}
          >
            <Server className="h-4 w-4 mr-1" />
            Backend
          </Button>

          <Button
            variant={selectedCategory === 'fullstack' ? 'default' : 'outline'}
            size="sm"
            className={selectedCategory === 'fullstack' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'text-gray-400 border-gray-700'}
            onClick={() => handleCategorySelect('fullstack')}
          >
            <Layers className="h-4 w-4 mr-1" />
            Full Stack
          </Button>

          <Button
            variant={selectedCategory === 'mobile' ? 'default' : 'outline'}
            size="sm"
            className={selectedCategory === 'mobile' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'text-gray-400 border-gray-700'}
            onClick={() => handleCategorySelect('mobile')}
          >
            <Smartphone className="h-4 w-4 mr-1" />
            Mobile
          </Button>

          <Button
            variant={selectedCategory === 'other' ? 'default' : 'outline'}
            size="sm"
            className={selectedCategory === 'other' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'text-gray-400 border-gray-700'}
            onClick={() => handleCategorySelect('other')}
          >
            <Package className="h-4 w-4 mr-1" />
            Outros
          </Button>
        </div>

        <div className="template-selector-list flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-400">
              Nenhum template encontrado. Tente outra pesquisa ou categoria.
            </div>
          ) : (
            templates.map(template => (
              <LedEffect
                key={template.id}
                active={false}
                color="orange"
                intensity="low"
                pulse={false}
                className="h-full"
              >
                <div
                  className="template-card bg-black/60 border border-orange-500/20 rounded-lg overflow-hidden h-full flex flex-col cursor-pointer hover:border-orange-500/50 transition-all duration-200"
                  onClick={() => onSelectTemplate(template)}
                >
                  <div className="template-card-header p-4 border-b border-orange-500/20 flex items-center">
                    <div className="template-icon w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center mr-3">
                      {getCategoryIcon(template.category)}
                    </div>

                    <div>
                      <h3 className="text-white font-medium text-sm">{template.name}</h3>
                      <span className="text-xs text-gray-400 capitalize">{template.category}</span>
                    </div>
                  </div>

                  <div className="template-card-body p-4 flex-1">
                    <p className="text-gray-300 text-xs mb-4">{template.description}</p>

                    <div className="template-technologies">
                      <h4 className="text-xs text-gray-400 mb-2">Tecnologias:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.technologies.map(tech => (
                          <span
                            key={tech}
                            className="text-xs bg-orange-500/10 text-orange-300 px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="template-card-footer p-3 border-t border-orange-500/20 flex justify-end">
                    <Button
                      size="sm"
                      className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 text-xs"
                    >
                      Selecionar
                    </Button>
                  </div>
                </div>
              </LedEffect>
            ))
          )}
        </div>
      </div>
      </LedEffect>
    </div>
  );
}
