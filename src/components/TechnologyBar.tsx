"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Technology {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Definição das tecnologias com ícones reais
const technologies: Technology[] = [
  { id: 'python', name: 'Python', icon: '/icons/python-icon.svg', color: '#3776AB' },
  { id: 'react', name: 'React', icon: '/icons/react-icon.svg', color: '#61DAFB' },
  { id: 'nextjs', name: 'Next.js', icon: '/icons/nextjs-icon.svg', color: '#000000' },
  { id: 'vue', name: 'Vue', icon: '/icons/vue-icon.svg', color: '#4FC08D' },
  { id: 'angular', name: 'Angular', icon: '/icons/angular-icon.svg', color: '#DD0031' },
  { id: 'node', name: 'Node.js', icon: '/icons/nodejs-icon.svg', color: '#339933' },
  { id: 'flutter', name: 'Flutter', icon: '/icons/flutter-icon.svg', color: '#02569B' },
  { id: 'svelte', name: 'Svelte', icon: '/icons/svelte-icon.svg', color: '#FF3E00' },
];

interface TechnologyBarProps {
  variant?: 'compact' | 'expanded';
  onSelectTechnology?: (tech: Technology) => void;
}

export default function TechnologyBar({ 
  variant = 'compact', 
  onSelectTechnology 
}: TechnologyBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = variant === 'compact' ? 6 : 8;
  
  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : Math.ceil(technologies.length / itemsPerPage) - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => (prev < Math.ceil(technologies.length / itemsPerPage) - 1 ? prev + 1 : 0));
  };
  
  const handleTechClick = (tech: Technology) => {
    if (onSelectTechnology) {
      onSelectTechnology(tech);
    }
  };

  // Calcular tecnologias visíveis com base no índice atual
  const visibleTechnologies = technologies.slice(
    currentIndex * itemsPerPage, 
    Math.min((currentIndex + 1) * itemsPerPage, technologies.length)
  );

  if (variant === 'compact') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-gray-300 text-sm mb-2">Start coding an app</div>
        <div className="relative bg-[#111111] border border-gray-800 rounded-md p-2 overflow-hidden">
          <div className="flex items-center">
            <div className="flex items-center gap-3 mr-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 py-1 text-xs text-gray-300 bg-[#1a1a1a] border border-gray-700 rounded-md hover:bg-[#222222] hover:text-white flex items-center gap-1"
              >
                <span className="text-lg">+</span> New Workspace
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 py-1 text-xs text-gray-300 bg-[#1a1a1a] border border-gray-700 rounded-md hover:bg-[#222222] hover:text-white flex items-center gap-1"
              >
                <span className="text-lg">⤓</span> Import Repo
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              {visibleTechnologies.map((tech) => (
                <div 
                  key={tech.id}
                  className="flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110"
                  onClick={() => handleTechClick(tech)}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img 
                      src={tech.icon} 
                      alt={tech.name} 
                      className="w-6 h-6 object-contain" 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full w-6 h-6 p-0 bg-transparent text-gray-400 hover:text-white hover:bg-transparent"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative bg-[#0a0a0a] border border-gray-800 rounded-md p-4 overflow-hidden">
        <div className="text-center mb-4">
          <h3 className="text-white text-sm font-medium">Start coding with your favorite technology</h3>
        </div>
        
        <div className="flex items-center justify-center gap-4 py-2">
          {visibleTechnologies.map((tech) => (
            <div 
              key={tech.id}
              className="flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110"
              onClick={() => handleTechClick(tech)}
            >
              <div 
                className="w-12 h-12 flex items-center justify-center rounded-md bg-[#111111] p-1 border"
                style={{ borderColor: tech.color }}
              >
                <img 
                  src={tech.icon} 
                  alt={tech.name} 
                  className="w-8 h-8 object-contain" 
                />
              </div>
            </div>
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-1 top-1/2 transform -translate-y-1/2 rounded-full w-6 h-6 p-0 bg-transparent text-gray-400 hover:text-white hover:bg-transparent"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full w-6 h-6 p-0 bg-transparent text-gray-400 hover:text-white hover:bg-transparent"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
