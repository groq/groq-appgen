"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Camera, Check } from 'lucide-react';
import html2canvas from 'html2canvas';

interface FeedbackFormProps {
  onSubmit: (feedback: string, captureScreen?: boolean) => void;
  onCancel: () => void;
  capturedImage?: string | null;
}

export default function FeedbackForm({ onSubmit, onCancel, capturedImage }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(capturedImage || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      onSubmit(feedback, !!localImage);
    }
  };

  const handleCaptureScreen = async () => {
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(document.body);
      const imageData = canvas.toDataURL('image/png');
      setLocalImage(imageData);
    } catch (error) {
      console.error('Erro ao capturar tela:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-black/90 border border-gray-700 rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-lg font-medium text-white mb-6 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-orange-500" />
          Enviar mensagem ao agente de UX
        </h2>

        <form onSubmit={handleSubmit}>
          {localImage && (
            <div className="mb-4 border border-gray-700 rounded-md overflow-hidden">
              <img src={localImage} alt="Captura de tela" className="w-full" />
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-300 mb-2">
              O que você gostaria que o agente analisasse?
            </label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Descreva em detalhes o que você gostaria que o agente analisasse na interface..."
              className="w-full min-h-[150px] p-3 bg-black/50 border border-gray-700 rounded text-white text-sm"
              required
            />
          </div>

          {!localImage && (
            <div className="mb-6">
              <Button
                type="button"
                variant="outline"
                className="border-gray-700 text-gray-300 hover:border-orange-500/50 hover:text-white"
                onClick={handleCaptureScreen}
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2" />
                ) : (
                  <Camera className="h-4 w-4 mr-2" />
                )}
                {isCapturing ? 'Capturando...' : 'Capturar tela atual'}
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={!feedback.trim()}
            >
              <Check className="h-4 w-4 mr-2" />
              Enviar para análise
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
