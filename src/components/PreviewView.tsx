import React, { useState, useEffect } from 'react';
import { Maximize2, ExternalLink, RefreshCw, Crop, Loader, Edit, MousePointer, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LedEffect } from '@/components/ui/led-effect';
import { SplashScreen } from '@/components/ui/splash-screen';

interface PreviewViewProps {
  previewUrl: string;
  onRefresh: () => void;
  onMaximize: () => void;
  onOpenInBrowser: () => void;
  onCaptureSelection: () => void;
  onAnnotate?: () => void;
  onSelectElement?: () => void;
  onAnalyze?: () => void;
  isStartingServer?: boolean;
}

export function PreviewView({
  previewUrl,
  onRefresh,
  onMaximize,
  onOpenInBrowser,
  onCaptureSelection,
  onAnnotate,
  onSelectElement,
  onAnalyze,
  isStartingServer = false
}: PreviewViewProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="preview-view flex flex-col h-full">
      <div className="preview-header flex items-center justify-between p-2 border-b border-orange-500/20 bg-black/80">
        <div className="flex items-center">
          <span className="text-xs text-gray-300">Preview</span>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
            onClick={onRefresh}
            title="Atualizar"
            disabled={isStartingServer}
          >
            {isStartingServer ? (
              <Loader className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
            onClick={onCaptureSelection}
            title="Capturar seleção"
          >
            <Crop className="h-3.5 w-3.5" />
          </Button>

          {onAnnotate && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
              onClick={onAnnotate}
              title="Anotar interface"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
          )}

          {onSelectElement && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
              onClick={onSelectElement}
              title="Selecionar elemento"
            >
              <MousePointer className="h-3.5 w-3.5" />
            </Button>
          )}

          {onAnalyze && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
              onClick={onAnalyze}
              title="Analisar interface"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
            onClick={onMaximize}
            title="Maximizar"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>

          <Button
            size="sm"
            className="h-7 px-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 text-xs"
            onClick={onOpenInBrowser}
            title="Abrir no navegador"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            Abrir
          </Button>
        </div>
      </div>

      <div className="flex-1 relative">
        <LedEffect
          active={isLoading || isStartingServer}
          color="orange"
          intensity="medium"
          pulse={true}
          className="h-full w-full"
        >
          <div className="preview-content flex-1 bg-white relative h-full w-full rounded-lg overflow-hidden">
            {(isLoading || isStartingServer) && (
              <div className="absolute inset-0 z-10">
                <SplashScreen
                  state={isStartingServer ? 'coding' : 'loading'}
                  showText={true}
                />
              </div>
            )}

            {/* Splash screen para preview vazio */}
            {!isLoading && !isStartingServer && previewUrl === 'about:blank' && (
              <div className="absolute inset-0 z-10">
                <SplashScreen
                  state="empty"
                  showText={false}
                />
              </div>
            )}

            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </LedEffect>
      </div>
    </div>
  );
}
