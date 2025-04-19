import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SpeechButtonProps {
  text: string;
  voice?: string;
  disabled?: boolean;
  small?: boolean;
}

export function SpeechButton({
  text,
  voice = 'Fritz-PlayAI',
  disabled,
  small = false,
}: SpeechButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Função para reproduzir o texto como fala
  const playText = async () => {
    if (isPlaying) {
      stopPlaying();
      return;
    }

    setIsLoading(true);

    try {
      // Chamar a API de text-to-speech
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao converter texto para fala');
      }

      // Converter a resposta para blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Criar elemento de áudio
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        
        // Configurar eventos
        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audioRef.current.onerror = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          console.error('Erro ao reproduzir áudio');
        };
      } else {
        audioRef.current.src = audioUrl;
      }

      // Reproduzir áudio
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Erro ao converter texto para fala:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para parar a reprodução
  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <Button
      disabled={disabled || isLoading || !text}
      type="button"
      variant="ghost"
      size="icon"
      className={`rounded-full shrink-0 flex items-center justify-center ${small ? 'p-0 w-8 h-8' : 'px-3 min-w-[40px]'} relative z-10 ${
        isLoading ? "text-gray-500" :
        isPlaying ? "text-orange-500 hover:text-orange-600" : ""
      }`}
      onClick={playText}
      title={isPlaying ? 'Parar reprodução' : 'Ouvir texto'}
    >
      {isLoading ? (
        <Loader className={small ? "h-3.5 w-3.5 animate-spin" : "h-[1.375rem] w-[1.375rem] animate-spin"} />
      ) : isPlaying ? (
        <VolumeX className={small ? "h-3.5 w-3.5" : "h-[1.375rem] w-[1.375rem]"} />
      ) : (
        <Volume2 className={small ? "h-3.5 w-3.5" : "h-[1.375rem] w-[1.375rem]"} />
      )}
    </Button>
  );
}
