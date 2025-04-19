import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type SplashScreenState = 'initial' | 'loading' | 'coding' | 'empty';

interface SplashScreenProps {
  state?: SplashScreenState;
  className?: string;
  showText?: boolean;
  fullScreen?: boolean;
}

export function SplashScreen({
  state = 'initial',
  className,
  showText = true,
  fullScreen = false
}: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  
  // Para o estado inicial, esconder após alguns segundos
  useEffect(() => {
    if (state === 'initial') {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setVisible(true);
    }
  }, [state]);
  
  if (!visible) return null;
  
  // Determinar texto baseado no estado
  const getText = () => {
    if (!showText) return null;
    
    switch (state) {
      case 'loading':
        return 'Loading...';
      case 'coding':
        return 'Working...';
      default:
        return null;
    }
  };
  
  // Determinar opacidade baseada no estado
  const getOpacity = () => {
    switch (state) {
      case 'initial':
        return 'opacity-80';
      case 'loading':
        return 'opacity-70';
      case 'coding':
        return 'opacity-90';
      case 'empty':
        return 'opacity-40';
      default:
        return 'opacity-60';
    }
  };
  
  // Determinar animação baseada no estado
  const getAnimation = () => {
    switch (state) {
      case 'initial':
        return 'animate-pulse-slow';
      case 'loading':
        return 'animate-pulse';
      case 'coding':
        return 'animate-pulse-fast';
      case 'empty':
        return 'animate-pulse-very-slow';
      default:
        return 'animate-pulse-slow';
    }
  };
  
  // Determinar cor baseada no estado
  const getColor = () => {
    switch (state) {
      case 'initial':
        return 'text-orange-500';
      case 'loading':
        return 'text-orange-400';
      case 'coding':
        return 'text-blue-400';
      case 'empty':
        return 'text-orange-300';
      default:
        return 'text-orange-500';
    }
  };
  
  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center',
        fullScreen ? 'fixed inset-0 z-50 bg-black/90' : 'h-full w-full',
        className
      )}
    >
      <div className="relative">
        {/* Face do Nexus */}
        <div 
          className={cn(
            'relative z-10',
            getOpacity(),
            getAnimation()
          )}
        >
          <svg 
            width="120" 
            height="120" 
            viewBox="0 0 200 200" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={cn(getColor())}
          >
            <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="10" />
            <circle cx="65" cy="80" r="15" fill="currentColor" />
            <circle cx="135" cy="80" r="15" fill="currentColor" />
            <path d="M70 130 Q100 160 130 130" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
          </svg>
        </div>
        
        {/* Código binário de fundo (apenas para o estado 'coding') */}
        {state === 'coding' && (
          <div className="absolute inset-0 -z-10 overflow-hidden opacity-30">
            <div className="binary-code absolute inset-0 text-[8px] text-blue-300 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="binary-line" style={{ animationDelay: `${i * 0.1}s` }}>
                  {Array.from({ length: 30 }).map((_, j) => (
                    <span key={j}>{Math.round(Math.random())}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Texto */}
      {getText() && (
        <div 
          className={cn(
            'mt-6 font-mono text-lg tracking-wider',
            getColor()
          )}
        >
          {getText()}
        </div>
      )}
    </div>
  );
}
