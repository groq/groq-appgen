import React from 'react';
import { cn } from '@/lib/utils';

interface LedEffectProps {
  active?: boolean;
  color?: 'orange' | 'blue' | 'green';
  intensity?: 'low' | 'medium' | 'high';
  pulse?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function LedEffect({
  active = false,
  color = 'orange',
  intensity = 'medium',
  pulse = true,
  className,
  children
}: LedEffectProps) {
  // Mapear cores para valores CSS
  const colorMap = {
    orange: {
      low: 'rgba(249, 115, 22, 0.2)',
      medium: 'rgba(249, 115, 22, 0.4)',
      high: 'rgba(249, 115, 22, 0.6)'
    },
    blue: {
      low: 'rgba(59, 130, 246, 0.2)',
      medium: 'rgba(59, 130, 246, 0.4)',
      high: 'rgba(59, 130, 246, 0.6)'
    },
    green: {
      low: 'rgba(34, 197, 94, 0.2)',
      medium: 'rgba(34, 197, 94, 0.4)',
      high: 'rgba(34, 197, 94, 0.6)'
    }
  };

  // Obter a cor base para o efeito
  const baseColor = colorMap[color][intensity];
  
  // Classe para o efeito de pulso
  const pulseClass = pulse && active ? 'animate-pulse' : '';
  
  return (
    <div className={cn('relative', className)}>
      {/* Camada de conteúdo */}
      <div className="relative z-10">{children}</div>
      
      {/* Efeito LED */}
      {active && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Borda interna */}
          <div 
            className={cn(
              "absolute inset-0 rounded-[inherit] transition-opacity duration-300",
              pulseClass
            )}
            style={{
              boxShadow: `inset 0 0 0 1px ${baseColor}, inset 0 0 0 2px rgba(0, 0, 0, 0.1)`,
            }}
          />
          
          {/* Brilho externo */}
          <div 
            className={cn(
              "absolute inset-[-1px] rounded-[inherit] blur-[1px] transition-opacity duration-300",
              pulseClass
            )}
            style={{
              boxShadow: `0 0 5px 1px ${baseColor}`,
              opacity: 0.7
            }}
          />
          
          {/* Brilho mais amplo e suave */}
          <div 
            className={cn(
              "absolute inset-[-2px] rounded-[inherit] blur-[3px] transition-opacity duration-300",
              pulseClass
            )}
            style={{
              boxShadow: `0 0 8px 2px ${baseColor}`,
              opacity: 0.4
            }}
          />
        </div>
      )}
    </div>
  );
}
