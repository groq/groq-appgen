import React, { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/ui/splash-screen';

interface SplashScreenWrapperProps {
  children: React.ReactNode;
}

export function SplashScreenWrapper({ children }: SplashScreenWrapperProps) {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // Esconder o splash screen após 2.5 segundos
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {showSplash ? (
        <SplashScreen 
          state="initial" 
          fullScreen={true} 
          showText={false} 
        />
      ) : (
        children
      )}
    </>
  );
}
