"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Code, Braces, FileCode, Layers, Palette, Database, Server, Globe, Cpu, Boxes, Workflow, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Technology {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const technologies: Technology[] = [
  { id: 'python', name: 'Python', icon: <Code size={20} color="#3776AB" />, color: '#3776AB' },
  { id: 'react', name: 'React', icon: <Braces size={20} color="#61DAFB" />, color: '#61DAFB' },
  { id: 'next', name: 'Next.js', icon: <FileCode size={20} color="#000000" />, color: '#000000' },
  { id: 'vue', name: 'Vue', icon: <Layers size={20} color="#4FC08D" />, color: '#4FC08D' },
  { id: 'angular', name: 'Angular', icon: <Palette size={20} color="#DD0031" />, color: '#DD0031' },
  { id: 'node', name: 'Node.js', icon: <Server size={20} color="#339933" />, color: '#339933' },
  { id: 'typescript', name: 'TypeScript', icon: <Code size={20} color="#3178C6" />, color: '#3178C6' },
  { id: 'flutter', name: 'Flutter', icon: <Layers size={20} color="#02569B" />, color: '#02569B' },
  { id: 'firebase', name: 'Firebase', icon: <Database size={20} color="#FFCA28" />, color: '#FFCA28' },
  { id: 'aws', name: 'AWS', icon: <Globe size={20} color="#FF9900" />, color: '#FF9900' },
  { id: 'graphql', name: 'GraphQL', icon: <Cpu size={20} color="#E10098" />, color: '#E10098' },
  { id: 'tailwind', name: 'Tailwind', icon: <Boxes size={20} color="#06B6D4" />, color: '#06B6D4' },
];

interface TechnologyCarouselProps {
  onSelectTechnology?: (tech: Technology) => void;
}

export default function TechnologyCarousel({ onSelectTechnology }: TechnologyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 8; // Number of items visible at once

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

  // Calculate visible technologies based on current index
  const visibleTechnologies = technologies.slice(
    currentIndex * itemsPerPage,
    Math.min((currentIndex + 1) * itemsPerPage, technologies.length)
  );

  return (
    <div
      className="relative w-full max-w-4xl mx-auto"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Neon border effect */}
      <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-orange-500/30 via-orange-300/20 to-orange-500/30 blur-sm z-[-1] opacity-70"></div>

      {/* Main container */}
      <div className="relative bg-black/60 border border-gray-800 rounded-lg p-4 overflow-hidden">
        {/* Text at the center */}
        <div className="text-center mb-4">
          <h3 className="text-white text-sm font-medium">Create your next project with any technology</h3>
        </div>

        {/* Carousel container */}
        <div
          ref={carouselRef}
          className="flex items-center justify-center gap-4 py-2 transition-all duration-300 ease-in-out"
        >
          {visibleTechnologies.map((tech) => (
            <div
              key={tech.id}
              className="flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110"
              onClick={() => handleTechClick(tech)}
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded-md bg-black/40 p-1.5 border border-gray-800 hover:border-orange-500/50 transition-colors"
                style={{ boxShadow: `0 0 10px ${tech.color}30` }}
              >
                {tech.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute left-1 top-1/2 transform -translate-y-1/2 rounded-full bg-black/70 text-gray-400 hover:text-white hover:bg-black/90 transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          onClick={handlePrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full bg-black/70 text-gray-400 hover:text-white hover:bg-black/90 transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Pagination dots */}
        <div className="flex justify-center mt-3 gap-1">
          {Array.from({ length: Math.ceil(technologies.length / itemsPerPage) }).map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${currentIndex === index ? 'bg-orange-500' : 'bg-gray-700'}`}
              onClick={() => setCurrentIndex(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
