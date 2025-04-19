"use client";

import React, { useState, useEffect, useRef } from 'react';

interface AugmentLogoProps {
  className?: string;
  size?: number;
}

// Frames binários pré-definidos para evitar problemas de hidratação
const BINARY_FRAMES = [
  `0 1 0 1 0 1 0 1 0 1 0 1
1 0 1 0 1 0 1 0 1 0 1 0
0 1 0 1 0 1 0 1 0 1 0 1
1 0 1 0 1 0 1 0 1 0 1 0
0 1 0 1 0 1 0 1 0 1 0 1
1 0 1 0 1 0 1 0 1 0 1 0
0 1 0 1 0 1 0 1 0 1 0 1
1 0 1 0 1 0 1 0 1 0 1 0
0 1 0 1 0 1 0 1 0 1 0 1
1 0 1 0 1 0 1 0 1 0 1 0
0 1 0 1 0 1 0 1 0 1 0 1
1 0 1 0 1 0 1 0 1 0 1 0`,

  `1 0 1 0 1 0 1 0 1 0 1 0
0 1 0 1 0 1 0 1 0 1 0 1
1 0 1 0 1 0 1 0 1 0 1 0
0 1 0 1 0 1 0 1 0 1 0 1
1 0 1 0 1 0 1 0 1 0 1 0
0 1 0 1 0 1 0 1 0 1 0 1
1 0 1 0 1 0 1 0 1 0 1 0
0 1 0 1 0 1 0 1 0 1 0 1
1 0 1 0 1 0 1 0 1 0 1 0
0 1 0 1 0 1 0 1 0 1 0 1
1 0 1 0 1 0 1 0 1 0 1 0
0 1 0 1 0 1 0 1 0 1 0 1`,

  `1 1 0 0 1 1 0 0 1 1 0 0
0 0 1 1 0 0 1 1 0 0 1 1
1 1 0 0 1 1 0 0 1 1 0 0
0 0 1 1 0 0 1 1 0 0 1 1
1 1 0 0 1 1 0 0 1 1 0 0
0 0 1 1 0 0 1 1 0 0 1 1
1 1 0 0 1 1 0 0 1 1 0 0
0 0 1 1 0 0 1 1 0 0 1 1
1 1 0 0 1 1 0 0 1 1 0 0
0 0 1 1 0 0 1 1 0 0 1 1
1 1 0 0 1 1 0 0 1 1 0 0
0 0 1 1 0 0 1 1 0 0 1 1`,

  `0 0 1 1 0 0 1 1 0 0 1 1
1 1 0 0 1 1 0 0 1 1 0 0
0 0 1 1 0 0 1 1 0 0 1 1
1 1 0 0 1 1 0 0 1 1 0 0
0 0 1 1 0 0 1 1 0 0 1 1
1 1 0 0 1 1 0 0 1 1 0 0
0 0 1 1 0 0 1 1 0 0 1 1
1 1 0 0 1 1 0 0 1 1 0 0
0 0 1 1 0 0 1 1 0 0 1 1
1 1 0 0 1 1 0 0 1 1 0 0
0 0 1 1 0 0 1 1 0 0 1 1
1 1 0 0 1 1 0 0 1 1 0 0`
];

const AugmentLogo: React.FC<AugmentLogoProps> = ({ className = '', size = 100 }) => {
  const [frame, setFrame] = useState(0);
  const [robotScale, setRobotScale] = useState(0.9);
  const [backgroundScale, setBackgroundScale] = useState(1.0); // Reduzido de 1.2 para 1.0
  const [robotOpacity, setRobotOpacity] = useState(1);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.5);
  const [zoomDirection, setZoomDirection] = useState<'in' | 'out'>('in');
  const [zoomProgress, setZoomProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastFrameTime = useRef(0);

  const currentBinaryFrame = BINARY_FRAMES[frame % 4];

  // Animação de pulsar e crescer/diminuir com efeito de ir e voltar do mundo binário
  const animate = (timestamp: number) => {
    // Controlar a velocidade da animação
    if (timestamp - lastFrameTime.current > 300) { // Velocidade ajustada para os números binários
      setFrame(prev => (prev + 1) % 16);
      lastFrameTime.current = timestamp;
    }

    // Efeito de zoom in/out para simular o robô indo e voltando do mundo binário
    setZoomProgress(prev => {
      const step = zoomDirection === 'in' ? 0.004 : -0.004; // Movimento um pouco mais rápido
      const newProgress = prev + step;

      // Mudar a direção quando atingir os limites
      if (newProgress >= 1 && zoomDirection === 'in') {
        setZoomDirection('out');
        return 1;
      } else if (newProgress <= 0 && zoomDirection === 'out') {
        setZoomDirection('in');
        return 0;
      }

      return newProgress;
    });

    // Aplicar efeitos com base no progresso do zoom
    const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const easedProgress = easeInOut(zoomProgress);

    // Robô cresce quando vem para frente e diminui quando vai para o mundo binário
    setRobotScale(0.95 + (easedProgress * 0.25));

    // Fundo binário fica maior quando o robô está "dentro" dele
    setBackgroundScale(1.3 - (easedProgress * 0.35));

    // Opacidade do robô aumenta quando ele vem para frente
    setRobotOpacity(0.85 + (easedProgress * 0.25));

    // Opacidade do fundo binário aumenta quando o robô está "dentro" dele
    setBackgroundOpacity(0.6 - (easedProgress * 0.2));

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Iniciar animação
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      // Limpar animação
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`${className}`}
      style={{
        width: size * 1.6, // Reduzido de 1.8 para 1.6
        height: size * 1.6, // Reduzido de 1.8 para 1.6
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {/* Mundo binário de fundo - camada mais externa */}
      <div
        className="absolute z-0 overflow-hidden rounded-full"
        style={{
          width: size * 2.0, // Reduzido para 2.0
          height: size * 2.0, // Reduzido para 2.0
          top: -size * 0.2, // Centralizado
          left: -size * 0.2, // Centralizado
          opacity: backgroundOpacity * 0.6,
          transition: 'all 800ms ease-in-out'
        }}
      >
        <pre
          className="text-[10px] text-orange-500 font-mono"
          style={{
            transform: `scale(${backgroundScale * 1.2})`,
            transformOrigin: 'center',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            letterSpacing: '3px',
            lineHeight: '1.8',
          }}
        >
          {BINARY_FRAMES[(frame + 1) % 4]}
        </pre>
      </div>

      {/* Camada binária média */}
      <div
        className="absolute z-1 overflow-hidden rounded-full"
        style={{
          width: size * 1.6, // Reduzido para 1.6
          height: size * 1.6, // Reduzido para 1.6
          top: -size * 0.0, // Centralizado
          left: -size * 0.0, // Centralizado
          opacity: backgroundOpacity * 0.8,
          transition: 'all 700ms ease-in-out'
        }}
      >
        <pre
          className="text-[9px] text-orange-500 font-mono"
          style={{
            transform: `scale(${backgroundScale})`,
            transformOrigin: 'center',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            letterSpacing: '2.5px',
            lineHeight: '1.6',
          }}
        >
          {currentBinaryFrame}
        </pre>
      </div>

      {/* Efeito de glow */}
      <div
        className="absolute rounded-full bg-orange-500/30 blur-xl z-5"
        style={{
          width: size * 1.4,
          height: size * 1.4,
          opacity: robotOpacity * 0.9,
          transform: `scale(${robotScale * 0.95})`,
          transition: 'all 500ms ease-in-out'
        }}
      />

      {/* Logo principal */}
      <div
        className="relative z-10"
        style={{
          transform: `scale(${robotScale})`,
          opacity: robotOpacity,
          transition: 'all 500ms ease-in-out'
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="8" cy="12" r="2" fill="currentColor" />
          <circle cx="16" cy="12" r="2" fill="currentColor" />
          <line x1="7" y1="3" x2="7" y2="1" stroke="currentColor" strokeWidth="2" />
          <line x1="17" y1="3" x2="17" y2="1" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* Camada binária interna - mais próxima do robô */}
      <div
        className="absolute z-20 overflow-hidden mix-blend-overlay"
        style={{
          width: size * 1.3, // Reduzido para 1.3
          height: size * 1.3, // Reduzido para 1.3
          top: -size * 0.15, // Centralizado
          left: -size * 0.15, // Centralizado
          opacity: backgroundOpacity * 1.0,
          pointerEvents: 'none',
          mask: 'radial-gradient(circle, transparent 25%, black 55%)',
          transition: 'all 600ms ease-in-out'
        }}
      >
        <pre
          className="text-[8px] text-orange-500 font-mono"
          style={{
            transform: `scale(${backgroundScale * 0.8})`,
            transformOrigin: 'center',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            letterSpacing: '3px',
            lineHeight: '1.8',
          }}
        >
          {BINARY_FRAMES[(frame + 2) % 4]}
        </pre>
      </div>
    </div>
  );
};

export default AugmentLogo;
