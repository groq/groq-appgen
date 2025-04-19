import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowRight, Loader, Search, ClipboardList, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LedEffect } from '@/components/ui/led-effect';
import { MicrophoneButton } from '@/components/MicrophoneButton';
import { ChatMessage } from './ChatMessage';
import { SearchModule } from './SearchModule';
import { SearchResult } from '@/utils/web-search';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  type: 'text' | 'progress' | 'form' | 'choices' | 'code' | 'result';
  content: any;
  timestamp: Date;
}

interface EnhancedChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onOptimizePrompt: () => void;
  onSearch: (query: string) => Promise<void>;
  onActivateModule: (module: 'optimize' | 'search' | 'plan' | 'template' | 'visual-annotation' | 'element-selector' | 'progress') => void;
  isGenerating: boolean;
  isSearching: boolean;
  searchResults: SearchResult[];
  searchSummary: string;
}

export function EnhancedChat({
  messages,
  onSendMessage,
  onOptimizePrompt,
  onSearch,
  onActivateModule,
  isGenerating,
  isSearching,
  searchResults,
  searchSummary
}: EnhancedChatProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Função para rolar para o final da lista de mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Rolar para o final quando novas mensagens são adicionadas
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Função para lidar com a submissão do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  // Função para lidar com transcrição do microfone
  const handleTranscription = (text: string) => {
    setInputValue((prev) => prev + ' ' + text);
    // Focar no input após a transcrição
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Função para ajustar a altura do textarea
  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  // Ajustar altura quando o valor do input muda
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  return (
    <div className="enhanced-chat flex flex-col h-full">
      {/* Área de mensagens */}
      <div className="messages-container flex-1 overflow-y-auto p-4 space-y-4">
        {/* Módulo de pesquisa (visível apenas quando ativo) */}
        {(isSearching || searchResults.length > 0) && (
          <SearchModule
            onSearch={onSearch}
            isSearching={isSearching}
            searchResults={searchResults}
            searchSummary={searchSummary}
          />
        )}

        {/* Mensagens */}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Elemento para rolar para o final */}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulário de entrada */}
      <form
        className="chat-input-form p-4 border-t border-orange-500/20 bg-black/60"
        onSubmit={handleSubmit}
      >
        <div className="w-full max-w-xl mx-auto relative flex items-center gap-2">
          {/* Botões de módulo */}
          <div className="module-buttons flex gap-1">
            <Button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center border border-orange-500/30 bg-black/60 text-gray-400 hover:text-orange-300 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all duration-200"
              title="Pesquisar na Internet"
              onClick={() => onActivateModule('search')}
            >
              <Search className="h-3.5 w-3.5" />
            </Button>

            <Button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center border border-orange-500/30 bg-black/60 text-gray-400 hover:text-orange-300 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all duration-200"
              title="Planejar Projeto"
              onClick={() => onActivateModule('plan')}
            >
              <ClipboardList className="h-3.5 w-3.5" />
            </Button>

            <Button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center border border-orange-500/30 bg-black/60 text-gray-400 hover:text-orange-300 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all duration-200"
              title="Usar Template"
              onClick={() => onActivateModule('template')}
            >
              <Layers className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Campo de texto */}
          <div className="relative flex-1">
            <LedEffect
              active={inputRef.current === document.activeElement || isGenerating}
              color="orange"
              intensity="medium"
              pulse={isGenerating}
              className="w-full"
            >
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Descreva seu app ou solicite alterações..."
                className="w-full bg-black/60 border border-orange-500/30 text-gray-200 rounded-lg px-4 py-2 pr-12 resize-none min-h-[40px] focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 placeholder-gray-500 text-sm"
                style={{
                  backdropFilter: 'blur(5px)',
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />

            {/* Botões dentro do campo */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {/* Botão de microfone */}
              <MicrophoneButton
                onTranscription={handleTranscription}
                small={true}
              />

              {/* Botão de otimização de prompt */}
              <button
                type="button"
                className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center p-0 text-gray-400 hover:text-orange-300 hover:bg-orange-500/20 transition-all duration-200"
                onClick={onOptimizePrompt}
                title="Otimizar Prompt"
              >
                <Sparkles className="h-3.5 w-3.5" />
              </button>

              {/* Botão de envio */}
              <button
                type="submit"
                disabled={isGenerating}
                className={`w-8 h-8 rounded-full flex items-center justify-center border border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all duration-200 ${inputValue.trim() ? 'bg-orange-500/10 text-orange-300' : 'text-gray-400'}`}
              >
                {isGenerating ? (
                  <Loader className="h-3 w-3 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
